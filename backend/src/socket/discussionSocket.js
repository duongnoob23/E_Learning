const jwt = require('jsonwebtoken');
const { TestDiscussion, TestComment, User } = require('../models');

// Middleware xác thực Socket.IO
const authenticateSocket = async (socket, next) => {
    try {
        // Lấy token từ nhiều nguồn khác nhau
        let token = socket.handshake.auth.token ||
                   socket.handshake.headers.authorization ||
                   socket.handshake.query.token;

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        // Xử lý token format
        if (token.startsWith('Bearer ')) {
            token = token.replace('Bearer ', '');
        }

        // Loại bỏ khoảng trắng và ký tự không mong muốn
        token = token.trim();

        if (!token || token === 'undefined' || token === 'null') {
            return next(new Error('Authentication error: Invalid token format'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Hỗ trợ cả user_id và userId
        const userId = decoded.user_id || decoded.userId;
        if (!userId) {
            return next(new Error('Authentication error: No user ID in token'));
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }
        socket.user = user;
        next();
    } catch (error) {
        console.error('Socket authentication error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return next(new Error('Authentication error: Invalid token format'));
        } else if (error.name === 'TokenExpiredError') {
            return next(new Error('Authentication error: Token expired'));
        } else {
            return next(new Error('Authentication error: ' + error.message));
        }
    }
};

// Xử lý Socket.IO cho Discussion
const handleDiscussionSocket = (io) => {
    io.use(authenticateSocket);

    io.on('connection', (socket) => {
        // Join room theo test_id
        socket.on('join_test_discussion', (test_id) => {
            const roomName = `test_${test_id}`;
            socket.join(roomName);
            console.log(`User ${socket.user.username} joined discussion room: ${roomName}`);
            
            // Thông báo cho user khác trong room
            socket.to(roomName).emit('user_joined_discussion', {
                user: {
                    user_id: socket.user.user_id,
                    username: socket.user.username,
                    full_name: socket.user.full_name,
                    avatar_url: socket.user.avatar_url
                },
                message: `${socket.user.full_name || socket.user.username} đã tham gia thảo luận`
            });
        });

        // Leave room
        socket.on('leave_test_discussion', (test_id) => {
            const roomName = `test_${test_id}`;
            socket.leave(roomName);
            console.log(`User ${socket.user.username} left discussion room: ${roomName}`);
            
            // Thông báo cho user khác trong room
            socket.to(roomName).emit('user_left_discussion', {
                user: {
                    user_id: socket.user.user_id,
                    username: socket.user.username,
                    full_name: socket.user.full_name
                },
                message: `${socket.user.full_name || socket.user.username} đã rời khỏi thảo luận`
            });
        });

        // Tạo discussion mới
        socket.on('create_discussion', async (data) => {
            try {
                const { test_id, title, content } = data;
                
                // Tạo discussion trong database
                const discussion = await TestDiscussion.create({
                    test_id,
                    user_id: socket.user.user_id,
                    title,
                    content
                });

                // Lấy discussion với thông tin user
                const discussionWithUser = await TestDiscussion.findOne({
                    where: { test_discussion_id: discussion.test_discussion_id },
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['user_id', 'username', 'full_name', 'avatar_url']
                        }
                    ]
                });

                const roomName = `test_${test_id}`;
                
                // Gửi discussion mới cho tất cả user trong room
                io.to(roomName).emit('new_discussion', {
                    discussion: discussionWithUser,
                    message: 'Có thảo luận mới được tạo'
                });

                // Gửi response cho user tạo
                socket.emit('discussion_created', {
                    success: true,
                    discussion: discussionWithUser
                });

            } catch (error) {
                console.error('Error creating discussion:', error);
                socket.emit('discussion_error', {
                    success: false,
                    message: 'Có lỗi xảy ra khi tạo thảo luận'
                });
            }
        });

        // Thêm comment mới
        socket.on('add_comment', async (data) => {
            try {
                const { test_discussion_id, content, parent_comment_id } = data;
                
                // Kiểm tra discussion có tồn tại không
                const discussion = await TestDiscussion.findByPk(test_discussion_id);
                if (!discussion) {
                    return socket.emit('comment_error', {
                        success: false,
                        message: 'Không tìm thấy thảo luận'
                    });
                }

                // Tạo comment trong database
                const comment = await TestComment.create({
                    test_discussion_id,
                    user_id: socket.user.user_id,
                    content,
                    parent_comment_id: parent_comment_id || null
                });

                // Lấy comment với thông tin user
                const commentWithUser = await TestComment.findOne({
                    where: { test_comment_id: comment.test_comment_id },
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['user_id', 'username', 'full_name', 'avatar_url']
                        }
                    ]
                });

                const roomName = `test_${discussion.test_id}`;
                
                // Gửi comment mới cho tất cả user trong room
                io.to(roomName).emit('new_comment', {
                    comment: commentWithUser,
                    discussion_id: test_discussion_id,
                    message: 'Có bình luận mới'
                });

                // Gửi response cho user comment
                socket.emit('comment_added', {
                    success: true,
                    comment: commentWithUser
                });

            } catch (error) {
                console.error('Error adding comment:', error);
                socket.emit('comment_error', {
                    success: false,
                    message: 'Có lỗi xảy ra khi thêm bình luận'
                });
            }
        });

        // User đang typing
        socket.on('typing_start', (data) => {
            const { test_id, discussion_id } = data;
            const roomName = `test_${test_id}`;
            
            socket.to(roomName).emit('user_typing', {
                user: {
                    user_id: socket.user.user_id,
                    username: socket.user.username,
                    full_name: socket.user.full_name
                },
                discussion_id,
                typing: true
            });
        });

        // User ngừng typing
        socket.on('typing_stop', (data) => {
            const { test_id, discussion_id } = data;
            const roomName = `test_${test_id}`;
            
            socket.to(roomName).emit('user_typing', {
                user: {
                    user_id: socket.user.user_id,
                    username: socket.user.username,
                    full_name: socket.user.full_name
                },
                discussion_id,
                typing: false
            });
        });

        // Xử lý disconnect
        socket.on('disconnect', () => {
            console.log(`User ${socket.user.username} disconnected from discussion socket`);
        });
    });
};

module.exports = { handleDiscussionSocket };

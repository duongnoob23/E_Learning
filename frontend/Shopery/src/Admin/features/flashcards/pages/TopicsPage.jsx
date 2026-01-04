import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiFunnel,
  HiChevronUpDown,
  HiEllipsisVertical,
  HiCheckCircle,
  HiXCircle,
  HiArrowPath,
  HiTrash,
  HiPencil,
  HiFolderOpen,
  HiViewColumns,
  HiQueueList,
} from "react-icons/hi2";
import { useAdminTopics, useAdminVocabStats } from "../../words/hooks/useWordsAdminQueries";
import {
  useDeleteTopic,
  useToggleTopicActive,
} from "../../words/hooks/useWordsAdminMutations";
import CreateTopicModal from "../components/CreateTopicModal";
import EditTopicModal from "../components/EditTopicModal";
import TopicCard from "../components/TopicCard";
import "./TopicsPage.scss";

export default function TopicsPage() {
  const navigate = useNavigate();
  
  // View mode: 'grid' or 'list'
  const [viewMode, setViewMode] = useState("grid");
  
  // Modal states
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editTopicId, setEditTopicId] = useState(null);
  
  // Filter & search states
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all, system, user_created
  const [activeFilter, setActiveFilter] = useState("all"); // all, true, false
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dropdown states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  
  const rowsPerPage = 12;
  
  // Queries
  const {
    data: topicsData,
    isLoading,
    error,
    refetch,
  } = useAdminTopics({
    page: currentPage,
    limit: rowsPerPage,
    search: search || undefined,
    topic_type: typeFilter !== "all" ? typeFilter : undefined,
    is_active: activeFilter !== "all" ? (activeFilter === "true" ? true : false) : undefined,
  });
  
  const { data: statsData } = useAdminVocabStats();
  
  // Mutations
  const deleteTopicMutation = useDeleteTopic();
  const toggleActiveMutation = useToggleTopicActive();
  
  // Process data
  const topics = useMemo(() => {
    return topicsData?.DT?.topics || [];
  }, [topicsData]);
  
  const pagination = useMemo(() => {
    return topicsData?.DT?.pagination || {
      current_page: currentPage,
      total_pages: 1,
      total_items: topics.length,
      items_per_page: rowsPerPage,
    };
  }, [topicsData, currentPage, topics.length, rowsPerPage]);
  
  const stats = statsData?.DT || {
    total_words: 0,
    active_words: 0,
    inactive_words: 0,
    total_topics: 0,
    active_topics: 0,
    system_topics: 0,
    today_new_words: 0,
  };
  
  const totalPages = pagination.total_pages || 1;
  
  // Handlers
  const handleViewTopic = (topicId) => {
    navigate(`/admin/flashcards/topics/${topicId}`);
  };
  
  const handleEditTopic = (topicId) => {
    setEditTopicId(topicId);
    setShowActionMenu(null);
  };
  
  const handleDeleteTopic = (topicId) => {
    if (window.confirm("Are you sure you want to delete this topic? This will not delete the words, but will deactivate the topic.")) {
      deleteTopicMutation.mutate(topicId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
    setShowActionMenu(null);
  };
  
  const handleToggleActive = (topicId) => {
    toggleActiveMutation.mutate(topicId, {
      onSuccess: () => {
        refetch();
      },
    });
    setShowActionMenu(null);
  };
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Prepare topics for display - Add (+) card at the beginning for grid view
  const displayTopics = useMemo(() => {
    if (viewMode === "grid") {
      return topics;
    }
    return topics;
  }, [topics, viewMode]);
  
  return (
    <div className="topics-page-root">
      {/* Breadcrumb */}
      <div className="topics-page__breadcrumb">
        <span>Home / <b>Flashcard Management</b></span>
      </div>
      
      {/* Header */}
      <div className="topics-page__header-row">
        <h1 className="topics-page__title">Flashcard Management</h1>
        <div className="topics-page__header-actions">
          <button
            className="topics-page__btn topics-page__btn--primary"
            onClick={() => setOpenCreateModal(true)}
          >
            <HiPlus /> Create Topic
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="topics-page__stats-row">
        <div className="topics-page__stat-card">
          <div className="topics-page__stat-icon" style={{ background: "#e0f2fe" }}>
            <HiFolderOpen style={{ color: "#0ea5e9" }} />
          </div>
          <div className="topics-page__stat-data">
            <div className="topics-page__stat-title">Total Topics</div>
            <div className="topics-page__stat-value">{stats.total_topics}</div>
          </div>
        </div>
        <div className="topics-page__stat-card">
          <div className="topics-page__stat-icon" style={{ background: "#d1fae5" }}>
            <HiCheckCircle style={{ color: "#10b981" }} />
          </div>
          <div className="topics-page__stat-data">
            <div className="topics-page__stat-title">Active Topics</div>
            <div className="topics-page__stat-value">{stats.active_topics}</div>
          </div>
        </div>
        <div className="topics-page__stat-card">
          <div className="topics-page__stat-icon" style={{ background: "#fef3c7" }}>
            <HiFolderOpen style={{ color: "#f59e0b" }} />
          </div>
          <div className="topics-page__stat-data">
            <div className="topics-page__stat-title">System Topics</div>
            <div className="topics-page__stat-value">{stats.system_topics}</div>
          </div>
        </div>
        <div className="topics-page__stat-card">
          <div className="topics-page__stat-icon" style={{ background: "#e0e7ff" }}>
            <HiFolderOpen style={{ color: "#6366f1" }} />
          </div>
          <div className="topics-page__stat-data">
            <div className="topics-page__stat-title">Total Words</div>
            <div className="topics-page__stat-value">{stats.total_words}</div>
          </div>
        </div>
      </div>
      
      {/* View Toggle & Filters */}
      <div className="topics-page__toolbar">
        <div className="topics-page__view-toggle">
          <button
            className={`topics-page__view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <HiViewColumns /> Grid
          </button>
          <button
            className={`topics-page__view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <HiQueueList /> List
          </button>
        </div>
        
        <div className="topics-page__filters">
          {/* Search */}
          <div className="topics-page__search">
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            <span className="topics-page__search-icon"><HiMagnifyingGlass /></span>
          </div>
          
          {/* Type Filter */}
          <select
            className="topics-page__filter-select"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Types</option>
            <option value="system">System</option>
            <option value="user_created">User Created</option>
          </select>
          
          {/* Status Filter */}
          <div className="topics-page__filter-wrapper">
            <button
              className="topics-page__filter-btn"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <HiFunnel /> Filter
            </button>
            {showFilterMenu && (
              <div className="topics-page__filter-dropdown">
                {[
                  { value: "all", label: "All Status" },
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ].map((opt) => (
                  <label key={opt.value} className="topics-page__filter-option">
                    <input
                      type="radio"
                      name="activeFilter"
                      checked={activeFilter === opt.value}
                      onChange={() => {
                        setActiveFilter(opt.value);
                        setShowFilterMenu(false);
                        setCurrentPage(1);
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {/* Sort */}
          <div className="topics-page__sort-wrapper">
            <button
              className="topics-page__sort-btn"
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <HiChevronUpDown /> Sort
            </button>
            {showSortMenu && (
              <div className="topics-page__sort-dropdown">
                {[
                  { key: "created_at", label: "Created Date" },
                  { key: "topic_name", label: "Name (A-Z)" },
                  { key: "word_count", label: "Word Count" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    className="topics-page__sort-option"
                    onClick={() => {
                      if (sortBy === opt.key) {
                        setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
                      } else {
                        setSortBy(opt.key);
                        setSortOrder("DESC");
                      }
                      setShowSortMenu(false);
                    }}
                  >
                    {opt.label}
                    {sortBy === opt.key && <span>{sortOrder === "ASC" ? "↑" : "↓"}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Refresh */}
          <button className="topics-page__refresh-btn" onClick={() => refetch()}>
            <HiArrowPath />
          </button>
        </div>
      </div>
      
      {/* Topics Display */}
      <div className={`topics-page__content topics-page__content--${viewMode}`}>
        {isLoading ? (
          <div className="topics-page__loading">Loading topics...</div>
        ) : error ? (
          <div className="topics-page__error">Error loading topics</div>
        ) : displayTopics.length === 0 ? (
          <div className="topics-page__empty">
            <HiFolderOpen />
            <p>No topics found. Create your first topic to get started.</p>
            <button
              className="topics-page__btn topics-page__btn--primary"
              onClick={() => setOpenCreateModal(true)}
            >
              <HiPlus /> Create Topic
            </button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="topics-page__grid">
                {/* Add Topic Card - Always first */}
                <div
                  className="topics-page__add-card"
                  onClick={() => setOpenCreateModal(true)}
                >
                  <div className="topics-page__add-card-icon">
                    <HiPlus />
                  </div>
                  <div className="topics-page__add-card-text">Create New Topic</div>
                </div>
                
                {/* Topic Cards */}
                {displayTopics.map((topic) => (
                  <TopicCard
                    key={topic.topic_id}
                    topic={topic}
                    onView={() => handleViewTopic(topic.topic_id)}
                    onEdit={() => handleEditTopic(topic.topic_id)}
                    onDelete={() => handleDeleteTopic(topic.topic_id)}
                    onToggleActive={() => handleToggleActive(topic.topic_id)}
                    showActionMenu={showActionMenu === topic.topic_id}
                    onToggleActionMenu={() =>
                      setShowActionMenu(showActionMenu === topic.topic_id ? null : topic.topic_id)
                    }
                  />
                ))}
              </div>
            )}
            
            {/* List View */}
            {viewMode === "list" && (
              <div className="topics-page__list">
                <table className="topics-page__table">
                  <thead>
                    <tr>
                      <th>Topic Name</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Word Count</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTopics.map((topic) => (
                      <tr key={topic.topic_id}>
                        <td>
                          <div className="topics-page__table-topic">
                            {topic.image_url && (
                              <img
                                src={topic.image_url}
                                alt={topic.topic_name}
                                className="topics-page__table-image"
                              />
                            )}
                            <span>{topic.topic_name}</span>
                          </div>
                        </td>
                        <td className="topics-page__table-desc">
                          {topic.description || "No description"}
                        </td>
                        <td>
                          <span
                            className={`topics-page__type-badge ${
                              topic.topic_type === "system"
                                ? "topics-page__type-badge--system"
                                : "topics-page__type-badge--user"
                            }`}
                          >
                            {topic.topic_type === "system" ? "SYSTEM" : "USER"}
                          </span>
                        </td>
                        <td>{topic.word_count || 0}</td>
                        <td>
                          <span
                            className={`topics-page__status-badge ${
                              topic.is_active
                                ? "topics-page__status-badge--active"
                                : "topics-page__status-badge--inactive"
                            }`}
                          >
                            {topic.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="topics-page__action-menu-wrapper">
                            <button
                              className="topics-page__action-menu-btn"
                              onClick={() =>
                                setShowActionMenu(
                                  showActionMenu === topic.topic_id ? null : topic.topic_id
                                )
                              }
                            >
                              <HiEllipsisVertical />
                            </button>
                            {showActionMenu === topic.topic_id && (
                              <div className="topics-page__action-menu-dropdown">
                                <button
                                  className="topics-page__action-menu-item"
                                  onClick={() => handleViewTopic(topic.topic_id)}
                                >
                                  View
                                </button>
                                <button
                                  className="topics-page__action-menu-item"
                                  onClick={() => handleEditTopic(topic.topic_id)}
                                >
                                  <HiPencil /> Edit
                                </button>
                                <button
                                  className="topics-page__action-menu-item"
                                  onClick={() => handleToggleActive(topic.topic_id)}
                                >
                                  {topic.is_active ? (
                                    <>
                                      <HiXCircle /> Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <HiCheckCircle /> Activate
                                    </>
                                  )}
                                </button>
                                <button
                                  className="topics-page__action-menu-item topics-page__action-menu-item--danger"
                                  onClick={() => handleDeleteTopic(topic.topic_id)}
                                >
                                  <HiTrash /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="topics-page__pagination">
          <button
            className="topics-page__pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Previous
          </button>
          <div className="topics-page__pagination-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`topics-page__pagination-number ${
                    currentPage === pageNum ? "topics-page__pagination-number--active" : ""
                  }`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            className="topics-page__pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
      
      {/* Modals */}
      {openCreateModal && (
        <CreateTopicModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => {
            setOpenCreateModal(false);
            refetch();
          }}
        />
      )}
      {editTopicId && (
        <EditTopicModal
          topicId={editTopicId}
          onClose={() => setEditTopicId(null)}
          onSuccess={() => {
            setEditTopicId(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}


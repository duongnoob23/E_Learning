import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiPlus,
  HiMagnifyingGlass,
  HiFunnel,
  HiChevronUpDown,
  HiEllipsisVertical,
  HiCheckCircle,
  HiXCircle,
  HiArrowPath,
  HiTrash,
  HiEye,
  HiPencil,
  HiSpeakerWave,
  HiArrowUpTray,
  HiPencilSquare,
} from "react-icons/hi2";
import { useAdminWords, useAdminAllTopics } from "../../words/hooks/useWordsAdminQueries";
import {
  useDeleteWord,
  useToggleWordActive,
  useRestoreWord,
  useBatchDeleteWords,
  useBatchToggleActive,
} from "../../words/hooks/useWordsAdminMutations";
import CreateWordModal from "../../words/components/CreateWordModal";
import EditWordModal from "../../words/components/EditWordModal";
import WordPreviewModal from "../../words/components/WordPreviewModal";
import BatchImportModal from "../../words/components/BatchImportModal";
import { wordsAdminApi } from "../../words/api/wordsAdminApi";
import "./TopicWordsPage.scss";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function TopicWordsPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  // Topic info state
  const [topicInfo, setTopicInfo] = useState(null);
  const [loadingTopic, setLoadingTopic] = useState(true);
  
  // Modal states
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [editWordId, setEditWordId] = useState(null);
  const [previewWordId, setPreviewWordId] = useState(null);
  
  // Filter & search states
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dropdown states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  
  const rowsPerPage = 10;
  
  // Load topic info
  useEffect(() => {
    if (topicId) {
      setLoadingTopic(true);
      wordsAdminApi.getTopics({ page: 1, limit: 1000 }).then((response) => {
        if (response?.EC === "0") {
          const topic = response.DT?.topics?.find((t) => t.topic_id === parseInt(topicId));
          if (topic) {
            setTopicInfo(topic);
          }
        }
        setLoadingTopic(false);
      });
    }
  }, [topicId]);
  
  // Queries - Only words from this topic
  const {
    data: wordsData,
    isLoading,
    error,
    refetch,
  } = useAdminWords({
    page: currentPage,
    limit: rowsPerPage,
    search: search || undefined,
    topic_id: topicId, // Filter by topic_id
    is_active: activeFilter !== "all" ? activeFilter : undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  
  const { data: topicsData } = useAdminAllTopics();
  
  // Mutations
  const deleteWordMutation = useDeleteWord();
  const toggleActiveMutation = useToggleWordActive();
  const restoreWordMutation = useRestoreWord();
  const batchDeleteMutation = useBatchDeleteWords();
  const batchToggleMutation = useBatchToggleActive();
  
  // Process data
  const words = useMemo(() => {
    return wordsData?.DT?.words || [];
  }, [wordsData]);
  
  const pagination = useMemo(() => {
    return wordsData?.DT?.pagination || {
      current_page: currentPage,
      total_pages: 1,
      total_items: words.length,
      items_per_page: rowsPerPage,
    };
  }, [wordsData, currentPage, words.length, rowsPerPage]);
  
  const topics = useMemo(() => {
    return topicsData?.DT || [];
  }, [topicsData]);
  
  const totalPages = pagination.total_pages || 1;
  
  // Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(words.map((w) => w.word_id));
    } else {
      setSelectedRows([]);
    }
  };
  
  const handleRowSelect = (wordId) => {
    setSelectedRows((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  };
  
  const handleDelete = (wordId) => {
    if (window.confirm("Are you sure you want to delete this word?")) {
      deleteWordMutation.mutate({ wordId });
    }
    setShowActionMenu(null);
  };
  
  const handleToggleActive = (wordId) => {
    toggleActiveMutation.mutate(wordId);
    setShowActionMenu(null);
  };
  
  const handleRestore = (wordId) => {
    restoreWordMutation.mutate(wordId);
    setShowActionMenu(null);
  };
  
  const handleBatchDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} words?`)) {
      batchDeleteMutation.mutate({ word_ids: selectedRows });
      setSelectedRows([]);
    }
  };
  
  const handleBatchToggleActive = (is_active) => {
    batchToggleMutation.mutate({ word_ids: selectedRows, is_active });
    setSelectedRows([]);
  };
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRows([]);
    }
  };
  
  // Play pronunciation audio
  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };
  
  if (loadingTopic) {
    return (
      <div className="topic-words-page-root">
        <div className="topic-words-page__loading">Loading topic...</div>
      </div>
    );
  }
  
  if (!topicInfo) {
    return (
      <div className="topic-words-page-root">
        <div className="topic-words-page__error">Topic not found</div>
        <button onClick={() => navigate("/admin/flashcards")}>Back to Topics</button>
      </div>
    );
  }
  
  return (
    <div className="topic-words-page-root">
      {/* Breadcrumb */}
      <div className="topic-words-page__breadcrumb">
        <span>
          Home / <button onClick={() => navigate("/admin/flashcards")}>Flashcards</button> / <b>{topicInfo.topic_name}</b>
        </span>
      </div>
      
      {/* Topic Header */}
      <div className="topic-words-page__header">
        <div className="topic-words-page__header-left">
          <button
            className="topic-words-page__back-btn"
            onClick={() => navigate("/admin/flashcards")}
          >
            <HiArrowLeft /> Back to Topics
          </button>
          <div className="topic-words-page__topic-info">
            {topicInfo.image_url && (
              <img
                src={topicInfo.image_url}
                alt={topicInfo.topic_name}
                className="topic-words-page__topic-image"
              />
            )}
            <div className="topic-words-page__topic-details">
              <h1 className="topic-words-page__topic-title">{topicInfo.topic_name}</h1>
              <p className="topic-words-page__topic-description">
                {topicInfo.description || "No description"}
              </p>
              <div className="topic-words-page__topic-meta">
                <span className={`topic-words-page__type-badge ${
                  topicInfo.topic_type === "system"
                    ? "topic-words-page__type-badge--system"
                    : "topic-words-page__type-badge--user"
                }`}>
                  {topicInfo.topic_type === "system" ? "SYSTEM" : "USER"}
                </span>
                <span className="topic-words-page__word-count">
                  {topicInfo.word_count || 0} words
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="topic-words-page__header-actions">
          <button
            className="topic-words-page__btn topic-words-page__btn--secondary"
            onClick={() => setOpenImportModal(true)}
          >
            <HiArrowUpTray /> Import Words
          </button>
          <button
            className="topic-words-page__btn topic-words-page__btn--primary"
            onClick={() => setOpenCreateModal(true)}
          >
            <HiPlus /> Add Word
          </button>
        </div>
      </div>
      
      {/* Words Table */}
      <div className="topic-words-page__table-wrapper">
        <div className="topic-words-page__table-header-row">
          <h2 className="topic-words-page__table-title">Words in this Topic</h2>
          <div className="topic-words-page__table-tools">
            {/* Search */}
            <div className="topic-words-page__table-search">
              <input
                type="text"
                placeholder="Search words..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              <span className="topic-words-page__search-icon"><HiMagnifyingGlass /></span>
            </div>
            
            {/* Filter */}
            <div className="topic-words-page__table-filter-wrapper">
              <button
                className="topic-words-page__table-tool-btn"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <HiFunnel /> Filter
              </button>
              {showFilterMenu && (
                <div className="topic-words-page__filter-dropdown">
                  {[
                    { value: "all", label: "All Status" },
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                  ].map((opt) => (
                    <label key={opt.value} className="topic-words-page__filter-option">
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
            <div className="topic-words-page__table-sort-wrapper">
              <button
                className="topic-words-page__table-tool-btn"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <HiChevronUpDown /> Sort
              </button>
              {showSortMenu && (
                <div className="topic-words-page__sort-dropdown">
                  {[
                    { key: "created_at", label: "Created Date" },
                    { key: "word", label: "Word (A-Z)" },
                    { key: "meaning_vi", label: "Meaning" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className="topic-words-page__sort-option"
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
            <button className="topic-words-page__table-tool-btn" onClick={() => refetch()}>
              <HiArrowPath />
            </button>
          </div>
        </div>
        
        {/* Bulk actions */}
        {selectedRows.length > 0 && (
          <div className="topic-words-page__bulk-actions-bar">
            <span>{selectedRows.length} word(s) selected</span>
            <div className="topic-words-page__bulk-btns">
              <button
                className="topic-words-page__btn topic-words-page__btn--success"
                onClick={() => handleBatchToggleActive(true)}
              >
                Activate
              </button>
              <button
                className="topic-words-page__btn topic-words-page__btn--warning"
                onClick={() => handleBatchToggleActive(false)}
              >
                Deactivate
              </button>
              <button
                className="topic-words-page__btn topic-words-page__btn--danger"
                onClick={handleBatchDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        
        {/* Table */}
        <div className="topic-words-page__table-scroll">
          <table className="topic-words-page__table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === words.length && words.length > 0}
                  />
                </th>
                <th>Word</th>
                <th>Meaning</th>
                <th>Part of Speech</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
                    Error loading words
                  </td>
                </tr>
              ) : words.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                    No words found in this topic. Add your first word!
                  </td>
                </tr>
              ) : (
                words.map((word) => (
                  <tr
                    key={word.word_id}
                    className={!word.is_active ? "topic-words-page__row-inactive" : ""}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(word.word_id)}
                        onChange={() => handleRowSelect(word.word_id)}
                      />
                    </td>
                    <td>
                      <div className="topic-words-page__word-cell">
                        <span className="topic-words-page__word-text">{word.word}</span>
                        {word.pronunciation && (
                          <span className="topic-words-page__pronunciation">
                            /{word.pronunciation}/
                          </span>
                        )}
                        {word.audio_url && (
                          <button
                            className="topic-words-page__audio-btn"
                            onClick={() => playAudio(word.audio_url)}
                          >
                            <HiSpeakerWave />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="topic-words-page__meaning">{word.meaning_vi}</td>
                    <td className="topic-words-page__pos">{word.part_of_speech || "N/A"}</td>
                    <td>
                      <span
                        className={`topic-words-page__status-badge ${
                          word.is_active
                            ? "topic-words-page__status-badge--active"
                            : "topic-words-page__status-badge--inactive"
                        }`}
                      >
                        {word.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="topic-words-page__created-date">
                      {formatDate(word.created_at)}
                    </td>
                    <td>
                      <div className="topic-words-page__action-menu-wrapper">
                        <button
                          className="topic-words-page__action-menu-btn"
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === word.word_id ? null : word.word_id
                            )
                          }
                        >
                          <HiEllipsisVertical />
                        </button>
                        {showActionMenu === word.word_id && (
                          <div className="topic-words-page__action-menu-dropdown">
                            <button
                              className="topic-words-page__action-menu-item"
                              onClick={() => {
                                setPreviewWordId(word.word_id);
                                setShowActionMenu(null);
                              }}
                            >
                              <HiEye /> Preview
                            </button>
                            <button
                              className="topic-words-page__action-menu-item"
                              onClick={() => {
                                setEditWordId(word.word_id);
                                setShowActionMenu(null);
                              }}
                            >
                              <HiPencil /> Edit
                            </button>
                            <button
                              className="topic-words-page__action-menu-item"
                              onClick={() => handleToggleActive(word.word_id)}
                            >
                              {word.is_active ? (
                                <>
                                  <HiXCircle /> Deactivate
                                </>
                              ) : (
                                <>
                                  <HiCheckCircle /> Activate
                                </>
                              )}
                            </button>
                            {!word.is_active && (
                              <button
                                className="topic-words-page__action-menu-item"
                                onClick={() => handleRestore(word.word_id)}
                              >
                                <HiArrowPath /> Restore
                              </button>
                            )}
                            <button
                              className="topic-words-page__action-menu-item topic-words-page__action-menu-item--danger"
                              onClick={() => handleDelete(word.word_id)}
                            >
                              <HiTrash /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="topic-words-page__table-pagination">
          <button
            className="topic-words-page__pagination-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Previous
          </button>
          <div className="topic-words-page__pagination-numbers">
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
                  className={`topic-words-page__pagination-number ${
                    currentPage === pageNum
                      ? "topic-words-page__pagination-number--active"
                      : ""
                  }`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            className="topic-words-page__pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Modals */}
      {openCreateModal && (
        <CreateWordModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => {
            setOpenCreateModal(false);
            refetch();
            // Reload topic info to update word count
            wordsAdminApi.getTopics({ page: 1, limit: 1000 }).then((response) => {
              if (response?.EC === "0") {
                const topic = response.DT?.topics?.find((t) => t.topic_id === parseInt(topicId));
                if (topic) {
                  setTopicInfo(topic);
                }
              }
            });
          }}
          topics={topics}
          defaultTopicId={parseInt(topicId)}
        />
      )}
      {editWordId && (
        <EditWordModal
          wordId={editWordId}
          onClose={() => setEditWordId(null)}
          onSuccess={() => {
            setEditWordId(null);
            refetch();
          }}
          topics={topics}
        />
      )}
      {previewWordId && (
        <WordPreviewModal
          wordId={previewWordId}
          onClose={() => setPreviewWordId(null)}
        />
      )}
      {openImportModal && (
        <BatchImportModal
          onClose={() => setOpenImportModal(false)}
          onSuccess={() => {
            setOpenImportModal(false);
            refetch();
            // Reload topic info
            wordsAdminApi.getTopics({ page: 1, limit: 1000 }).then((response) => {
              if (response?.EC === "0") {
                const topic = response.DT?.topics?.find((t) => t.topic_id === parseInt(topicId));
                if (topic) {
                  setTopicInfo(topic);
                }
              }
            });
          }}
          topics={topics}
          defaultTopicId={parseInt(topicId)}
        />
      )}
    </div>
  );
}


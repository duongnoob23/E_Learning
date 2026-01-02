import React, { useMemo, useState } from "react";
import {
  HiBookOpen,
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
  HiArrowDownTray,
  HiArrowUpTray,
  HiFolderOpen,
} from "react-icons/hi2";
import { useAdminWords, useAdminVocabStats, useAdminAllTopics } from "../hooks/useWordsAdminQueries";
import {
  useDeleteWord,
  useToggleWordActive,
  useRestoreWord,
  useBatchDeleteWords,
  useBatchToggleActive,
} from "../hooks/useWordsAdminMutations";
import CreateWordModal from "../components/CreateWordModal";
import EditWordModal from "../components/EditWordModal";
import WordPreviewModal from "../components/WordPreviewModal";
import BatchImportModal from "../components/BatchImportModal";
import "./WordsPage.scss";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function WordsPage() {
  // Modal states
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [editWordId, setEditWordId] = useState(null);
  const [previewWordId, setPreviewWordId] = useState(null);

  // Filter & search states
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
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

  // Queries
  const {
    data: wordsData,
    isLoading,
    error,
    refetch,
  } = useAdminWords({
    page: currentPage,
    limit: rowsPerPage,
    search: search || undefined,
    topic_id: topicFilter || undefined,
    is_active: activeFilter !== "all" ? activeFilter : undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const { data: statsData } = useAdminVocabStats();
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

  const stats = statsData?.DT || {
    total_words: 0,
    active_words: 0,
    inactive_words: 0,
    total_topics: 0,
    today_new_words: 0,
  };

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
    if (window.confirm("Bạn có chắc chắn muốn xóa từ vựng này?")) {
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
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedRows.length} từ vựng?`)) {
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

  return (
    <div className="words-page-root">
      {/* Breadcrumb */}
      <div className="words-page__breadcrumb">
        <span>Home / <b>Vocabulary</b></span>
      </div>

      {/* Header */}
      <div className="words-page__header-row">
        <h1 className="words-page__title">Vocabulary Management</h1>
        <div className="words-page__header-actions">
          <button className="words-page__btn words-page__btn--secondary" onClick={() => setOpenImportModal(true)}>
            <HiArrowUpTray /> Import
          </button>
          <button className="words-page__btn words-page__btn--primary" onClick={() => setOpenCreateModal(true)}>
            <HiPlus /> Add Word
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="words-page__stats-row">
        <div className="words-page__stat-card">
          <div className="words-page__stat-icon" style={{ background: "#e0f2fe" }}>
            <HiBookOpen style={{ color: "#0ea5e9" }} />
          </div>
          <div className="words-page__stat-data">
            <div className="words-page__stat-title">Total Words</div>
            <div className="words-page__stat-value">{stats.total_words}</div>
          </div>
        </div>
        <div className="words-page__stat-card">
          <div className="words-page__stat-icon" style={{ background: "#d1fae5" }}>
            <HiCheckCircle style={{ color: "#10b981" }} />
          </div>
          <div className="words-page__stat-data">
            <div className="words-page__stat-title">Active Words</div>
            <div className="words-page__stat-value">{stats.active_words}</div>
          </div>
        </div>
        <div className="words-page__stat-card">
          <div className="words-page__stat-icon" style={{ background: "#fee2e2" }}>
            <HiXCircle style={{ color: "#ef4444" }} />
          </div>
          <div className="words-page__stat-data">
            <div className="words-page__stat-title">Inactive Words</div>
            <div className="words-page__stat-value">{stats.inactive_words}</div>
          </div>
        </div>
        <div className="words-page__stat-card">
          <div className="words-page__stat-icon" style={{ background: "#fef3c7" }}>
            <HiFolderOpen style={{ color: "#f59e0b" }} />
          </div>
          <div className="words-page__stat-data">
            <div className="words-page__stat-title">Topics</div>
            <div className="words-page__stat-value">{stats.total_topics}</div>
          </div>
        </div>
        <div className="words-page__stat-card">
          <div className="words-page__stat-icon" style={{ background: "#e0e7ff" }}>
            <HiPlus style={{ color: "#6366f1" }} />
          </div>
          <div className="words-page__stat-data">
            <div className="words-page__stat-title">New Today</div>
            <div className="words-page__stat-value">{stats.today_new_words}</div>
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="words-page__table-wrapper">
        <div className="words-page__table-header-row">
          <h2 className="words-page__table-title">Words List</h2>
          <div className="words-page__table-tools">
            {/* Search */}
            <div className="words-page__table-search">
              <input
                type="text"
                placeholder="Search words..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              <span className="words-page__search-icon"><HiMagnifyingGlass /></span>
            </div>

            {/* Topic Filter */}
            <select
              className="words-page__topic-select"
              value={topicFilter}
              onChange={(e) => { setTopicFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_id}>
                  {topic.topic_name} ({topic.word_count})
                </option>
              ))}
            </select>

            {/* Filter */}
            <div className="words-page__table-filter-wrapper">
              <button className="words-page__table-tool-btn" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                <HiFunnel /> Filter
              </button>
              {showFilterMenu && (
                <div className="words-page__filter-dropdown">
                  {[
                    { value: "all", label: "All Status" },
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                  ].map((opt) => (
                    <label key={opt.value} className="words-page__filter-option">
                      <input
                        type="radio"
                        name="activeFilter"
                        checked={activeFilter === opt.value}
                        onChange={() => { setActiveFilter(opt.value); setShowFilterMenu(false); setCurrentPage(1); }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="words-page__table-sort-wrapper">
              <button className="words-page__table-tool-btn" onClick={() => setShowSortMenu(!showSortMenu)}>
                <HiChevronUpDown /> Sort
              </button>
              {showSortMenu && (
                <div className="words-page__sort-dropdown">
                  {[
                    { key: "created_at", label: "Created Date" },
                    { key: "word", label: "Word (A-Z)" },
                    { key: "meaning_vi", label: "Meaning" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className="words-page__sort-option"
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
            <button className="words-page__table-tool-btn" onClick={() => refetch()}>
              <HiArrowPath />
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedRows.length > 0 && (
          <div className="words-page__bulk-actions-bar">
            <span>{selectedRows.length} word(s) selected</span>
            <div className="words-page__bulk-btns">
              <button className="words-page__btn words-page__btn--success" onClick={() => handleBatchToggleActive(true)}>
                Activate
              </button>
              <button className="words-page__btn words-page__btn--warning" onClick={() => handleBatchToggleActive(false)}>
                Deactivate
              </button>
              <button className="words-page__btn words-page__btn--danger" onClick={handleBatchDelete}>
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="words-page__table-scroll">
          <table className="words-page__table">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === words.length && words.length > 0} /></th>
                <th>Word</th>
                <th>Meaning</th>
                <th>Topic</th>
                <th>Part of Speech</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px" }}>Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>Error loading words</td></tr>
              ) : words.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px" }}>No words found</td></tr>
              ) : (
                words.map((word) => (
                  <tr key={word.word_id} className={!word.is_active ? "words-page__row-inactive" : ""}>
                    <td><input type="checkbox" checked={selectedRows.includes(word.word_id)} onChange={() => handleRowSelect(word.word_id)} /></td>
                    <td>
                      <div className="words-page__word-cell">
                        <span className="words-page__word-text">{word.word}</span>
                        {word.pronunciation && <span className="words-page__pronunciation">/{word.pronunciation}/</span>}
                        {word.audio_url && (
                          <button className="words-page__audio-btn" onClick={() => playAudio(word.audio_url)}>
                            <HiSpeakerWave />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="words-page__meaning">{word.meaning_vi}</td>
                    <td>
                      <span className="words-page__topic-badge">
                        {word.Topic?.topic_name || "N/A"}
                      </span>
                    </td>
                    <td className="words-page__pos">{word.part_of_speech || "N/A"}</td>
                    <td>
                      <span className={`words-page__status-badge ${word.is_active ? "words-page__status-badge--active" : "words-page__status-badge--inactive"}`}>
                        {word.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="words-page__created-date">{formatDate(word.created_at)}</td>
                    <td>
                      <div className="words-page__action-menu-wrapper">
                        <button className="words-page__action-menu-btn" onClick={() => setShowActionMenu(showActionMenu === word.word_id ? null : word.word_id)}>
                          <HiEllipsisVertical />
                        </button>
                        {showActionMenu === word.word_id && (
                          <div className="words-page__action-menu-dropdown">
                            <button className="words-page__action-menu-item" onClick={() => { setPreviewWordId(word.word_id); setShowActionMenu(null); }}>
                              <HiEye /> Preview
                            </button>
                            <button className="words-page__action-menu-item" onClick={() => { setEditWordId(word.word_id); setShowActionMenu(null); }}>
                              <HiPencil /> Edit
                            </button>
                            <button className="words-page__action-menu-item" onClick={() => handleToggleActive(word.word_id)}>
                              {word.is_active ? <><HiXCircle /> Deactivate</> : <><HiCheckCircle /> Activate</>}
                            </button>
                            {!word.is_active && (
                              <button className="words-page__action-menu-item" onClick={() => handleRestore(word.word_id)}>
                                <HiArrowPath /> Restore
                              </button>
                            )}
                            <button className="words-page__action-menu-item words-page__action-menu-item--danger" onClick={() => handleDelete(word.word_id)}>
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
        <div className="words-page__table-pagination">
          <button className="words-page__pagination-btn" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Previous</button>
          <div className="words-page__pagination-numbers">
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
                  className={`words-page__pagination-number ${currentPage === pageNum ? "words-page__pagination-number--active" : ""}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button className="words-page__pagination-btn" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next</button>
        </div>
      </div>

      {/* Modals */}
      {openCreateModal && (
        <CreateWordModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => { setOpenCreateModal(false); refetch(); }}
          topics={topics}
        />
      )}
      {editWordId && (
        <EditWordModal
          wordId={editWordId}
          onClose={() => setEditWordId(null)}
          onSuccess={() => { setEditWordId(null); refetch(); }}
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
          onSuccess={() => { setOpenImportModal(false); refetch(); }}
          topics={topics}
        />
      )}
    </div>
  );
}


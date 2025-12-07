import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import { getAllAnnouncements } from "../../api/announcementApi";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import {
  FaEye,
  FaBullhorn,
  FaUsers,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";
import { ROUTES } from "../../utils/constants";
import useAuthStore from "../../store/authStore";

const SupportDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, announcementsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers({
          search: search || undefined,
          page: currentPage,
          limit: itemsPerPage,
        }),
        getAllAnnouncements(1, 10),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setAnnouncements(announcementsRes.data.announcements);
      
      // Pagination bilgilerini güncelle
      if (usersRes.data.pagination) {
        setTotalPages(usersRes.data.pagination.totalPages);
        setTotalItems(usersRes.data.pagination.total);
      }
    } catch (error) {
      console.error("Fetch data error:", error);
      toast.error("Veriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1); // Aramada ilk sayfaya dön
    fetchData();
  };

  const handleClearSearch = async () => {
    setSearch("");
    setCurrentPage(1);
    fetchData();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Yeni sayfa boyutunda ilk sayfaya dön
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await adminApi.getUserById(userId);
      setSelectedUser(response.data.user);
      setShowUserModal(true);
    } catch (error) {
      console.error("View user error:", error);
      toast.error("Kullanıcı detayları yüklenemedi");
    }
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await adminApi.deleteUser(userToDelete.id);
      toast.success("Kullanıcı silindi");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Kullanıcı silinemedi");
      }
    }
  };

  const getAnnouncementStatus = (announcement) => {
    if (!announcement.isActive)
      return { text: "Yayında Değil", variant: "secondary" };

    const now = new Date();
    const start = new Date(announcement.startDate);
    const end = new Date(announcement.endDate);

    if (now < start) return { text: "Planlanmış", variant: "info" };
    if (now > end) return { text: "Süresi Doldu", variant: "secondary" };
    return { text: "Aktif", variant: "success" };
  };

  // Pagination renderer
  const renderPagination = () => {
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // İlk sayfa
    if (startPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(1)} />
      );
    }

    // Önceki sayfa
    if (currentPage > 1) {
      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
        />
      );
    }

    // Sayfa numaraları
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Sonraki sayfa
    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
        />
      );
    }

    // Son sayfa
    if (endPage < totalPages) {
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => handlePageChange(totalPages)}
        />
      );
    }

    return <Pagination className="mb-0">{items}</Pagination>;
  };

  if (loading) {
    return <Loader />;
  }

  // Yetki kontrolü
  if (user?.role !== "support" && user?.role !== "admin") {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Bu sayfaya erişim yetkiniz yok</h3>
          <p className="text-muted">
            Sadece destek ve admin kullanıcıları bu sayfayı görüntüleyebilir.
          </p>
          <Button variant="primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Ana Sayfaya Dön
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2>🛟 Destek Paneli</h2>
              <p className="text-muted mb-0">
                Hoş geldin, {user?.firstName}! Kullanıcı ve bildirim yönetimi
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
              className="d-flex align-items-center gap-2"
            >
              <FaBullhorn />
              Bildirim Yönetimi
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon primary">
                <FaUsers size={24} />
              </div>
              <div className="stats-value">{stats?.totalUsers || 0}</div>
              <div className="stats-label">Toplam Kullanıcı</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon success">
                <FaCheckCircle size={24} />
              </div>
              <div className="stats-value">{stats?.confirmedUsers || 0}</div>
              <div className="stats-label">Onaylı Kullanıcı</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon info">
                <FaBullhorn size={24} />
              </div>
              <div className="stats-value">{announcements.length}</div>
              <div className="stats-label">Toplam Bildirim</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon warning">
                <FaInfoCircle size={24} />
              </div>
              <div className="stats-value">
                {
                  announcements.filter((a) => {
                    const now = new Date();
                    return (
                      a.isActive &&
                      new Date(a.startDate) <= now &&
                      new Date(a.endDate) >= now
                    );
                  }).length
                }
              </div>
              <div className="stats-label">Aktif Bildirim</div>
            </div>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <h5 className="mb-3">⚡ Hızlı İşlemler</h5>
                <div className="d-flex gap-3 flex-wrap">
                  <Button
                    variant="primary"
                    onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaBullhorn />
                    Bildirim Oluştur
                  </Button>

                  <Button
                    variant="info"
                    onClick={() => window.location.reload()}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaUsers />
                    Kullanıcıları Yenile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Announcements */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">📢 Son Bildirimler</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
                  >
                    Tümünü Gör
                  </Button>
                </div>

                {announcements.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Başlık</th>
                        <th>Tip</th>
                        <th>Durum</th>
                        <th>Oluşturulma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {announcements.slice(0, 5).map((announcement) => {
                        const status = getAnnouncementStatus(announcement);
                        return (
                          <tr key={announcement.id}>
                            <td>
                              <strong>{announcement.title}</strong>
                              <div
                                className="text-muted small text-truncate"
                                style={{ maxWidth: "300px" }}
                              >
                                {announcement.message}
                              </div>
                            </td>
                            <td>
                              <Badge
                                bg={
                                  announcement.type === "info"
                                    ? "info"
                                    : announcement.type === "success"
                                    ? "success"
                                    : announcement.type === "warning"
                                    ? "warning"
                                    : "danger"
                                }
                              >
                                {announcement.type === "info"
                                  ? "Bilgi"
                                  : announcement.type === "success"
                                  ? "Başarılı"
                                  : announcement.type === "warning"
                                  ? "Uyarı"
                                  : "Hata"}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={status.variant}>{status.text}</Badge>
                            </td>
                            <td className="small">
                              {new Date(
                                announcement.createdAt
                              ).toLocaleDateString("tr-TR")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <FaBullhorn
                      size={48}
                      className="mb-3"
                      style={{ opacity: 0.3 }}
                    />
                    <p>Henüz bildirim yok</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
                    >
                      İlk Bildirimi Oluştur
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Users Table - Read Only */}
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div>
                    <h5 className="mb-1">👥 Kullanıcılar</h5>
                    <small className="text-muted">
                      Toplam {totalItems} kullanıcı - Sayfa {currentPage} /{" "}
                      {totalPages}
                    </small>
                  </div>

                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    {/* Sayfa başına öğe sayısı */}
                    <Form.Select
                      size="sm"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      style={{ width: "auto" }}
                    >
                      <option value={10}>10 / sayfa</option>
                      <option value={20}>20 / sayfa</option>
                      <option value={50}>50 / sayfa</option>
                    </Form.Select>

                    {/* Arama */}
                    <Form onSubmit={handleSearch} className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "250px" }}
                        size="sm"
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={loading}
                      >
                        Ara
                      </Button>
                      {search && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={handleClearSearch}
                        >
                          Temizle
                        </Button>
                      )}
                    </Form>
                  </div>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Ad Soyad</th>
                      <th>E-posta</th>
                      <th>Rol</th>
                      <th>PrintNest</th>
                      <th>Kayıt Tarihi</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          {user.firstName} {user.lastName}
                          {user.isSuperAdmin && (
                            <Badge
                              bg="danger"
                              className="ms-2"
                              style={{ fontSize: "0.65rem" }}
                            >
                              SUPER ADMIN
                            </Badge>
                          )}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <Badge
                            bg={
                              user.role === "admin"
                                ? "primary"
                                : user.role === "support"
                                ? "info"
                                : "secondary"
                            }
                          >
                            {user.role === "admin"
                              ? "Admin"
                              : user.role === "support"
                              ? "Destek"
                              : "Kullanıcı"}
                          </Badge>
                        </td>
                        <td>
                          {user.printNestConfirmed ? (
                            <Badge bg="success">Onaylı</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">
                              Bekliyor
                            </Badge>
                          )}
                        </td>
                        <td>
                          {new Date(user.registeredAt).toLocaleDateString(
                            "tr-TR"
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleViewUser(user.id)}
                              title="Detayları Gör"
                            >
                              <FaEye />
                            </Button>

                            {!user.isSuperAdmin && user.role !== "admin" && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleOpenDeleteModal(user)}
                                title="Kullanıcıyı Sil"
                              >
                                <FaTrash />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {users.length === 0 && (
                  <p className="text-center text-muted py-3">
                    {search
                      ? "Arama sonucu kullanıcı bulunamadı"
                      : "Kullanıcı bulunamadı"}
                  </p>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                    <small className="text-muted">
                      Gösterilen:{" "}
                      {users.length > 0
                        ? (currentPage - 1) * itemsPerPage + 1
                        : 0}{" "}
                      - {Math.min(currentPage * itemsPerPage, totalItems)} /{" "}
                      {totalItems}
                    </small>
                    {renderPagination()}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* User Detail Modal */}
      <Modal
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Kullanıcı Detayları</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <h5>
                {selectedUser.firstName} {selectedUser.lastName}
              </h5>
              <p className="text-muted mb-3">{selectedUser.email}</p>

              <Row>
                <Col md={6}>
                  <p>
                    <strong>Rol:</strong>{" "}
                    <Badge
                      bg={
                        selectedUser.role === "admin"
                          ? "primary"
                          : selectedUser.role === "support"
                          ? "info"
                          : "secondary"
                      }
                    >
                      {selectedUser.role === "admin"
                        ? "Admin"
                        : selectedUser.role === "support"
                        ? "Destek"
                        : "Kullanıcı"}
                    </Badge>
                  </p>
                  <p>
                    <strong>Telefon:</strong> {selectedUser.phoneNumber || "-"}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Günlük Token:</strong>{" "}
                    <Badge bg="warning" text="dark">
                      {selectedUser.dailyTokens || 0} Token
                    </Badge>
                  </p>
                  <p>
                    <strong>PrintNest:</strong>{" "}
                    {selectedUser.printNestConfirmed
                      ? "✅ Onaylı"
                      : "⏳ Bekliyor"}
                  </p>
                </Col>
              </Row>

              {/* Etsy Mağazaları */}
              {selectedUser.etsyStores &&
                selectedUser.etsyStores.length > 0 && (
                  <>
                    <hr />
                    <h6>
                      🛍️ Etsy Mağazaları ({selectedUser.etsyStores.length})
                    </h6>
                    <Table size="sm" striped bordered>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Mağaza Bilgisi</th>
                          <th>Oluşturulma Tarihi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser.etsyStores.map((store, idx) => (
                          <tr key={store.id}>
                            <td>{idx + 1}</td>
                            <td>
                              {store.storeName ? (
                                <>
                                  <strong>{store.storeName}</strong>
                                  <br />
                                  <a
                                    href={store.storeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted small"
                                  >
                                    {store.storeUrl}
                                  </a>
                                </>
                              ) : (
                                <a
                                  href={store.storeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {store.storeUrl}
                                </a>
                              )}
                            </td>
                            <td>
                              {new Date(store.createdAt).toLocaleDateString(
                                "tr-TR"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                )}

              {(!selectedUser.etsyStores ||
                selectedUser.etsyStores.length === 0) && (
                <>
                  <hr />
                  <p className="text-muted">
                    <strong>🛍️ Etsy Mağazaları:</strong> Henüz mağaza eklenmemiş
                  </p>
                </>
              )}

              <hr />

              <p>
                <strong>Kayıt Tarihi:</strong>{" "}
                {new Date(selectedUser.registeredAt).toLocaleString("tr-TR")}
              </p>
              <p>
                <strong>Son Token Sıfırlama:</strong>{" "}
                {new Date(selectedUser.lastTokenReset).toLocaleString("tr-TR")}
              </p>

              {selectedUser.printNestSessions &&
                selectedUser.printNestSessions.length > 0 && (
                  <>
                    <hr />
                    <h6>📊 Son PrintNest Oturumları</h6>
                    <Table size="sm" striped>
                      <thead>
                        <tr>
                          <th>Açılış</th>
                          <th>Kapanış</th>
                          <th>Süre (dk)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser.printNestSessions
                          .slice(0, 5)
                          .map((session, idx) => (
                            <tr key={idx}>
                              <td>
                                {new Date(
                                  session.iframeOpenedAt
                                ).toLocaleString("tr-TR")}
                              </td>
                              <td>
                                {session.iframeClosedAt
                                  ? new Date(
                                      session.iframeClosedAt
                                    ).toLocaleString("tr-TR")
                                  : "Açık"}
                              </td>
                              <td>
                                {session.totalTimeSpent
                                  ? Math.round(session.totalTimeSpent / 60)
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </>
                )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Kapat
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kullanıcıyı Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <div>
              <p>
                <strong>
                  {userToDelete.firstName} {userToDelete.lastName}
                </strong>{" "}
                ({userToDelete.email}) kullanıcısını silmek istediğinizden emin
                misiniz?
              </p>
              <div className="alert alert-danger mb-0">
                <strong>⚠️ Uyarı:</strong> Bu işlem geri alınamaz!
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupportDashboard;

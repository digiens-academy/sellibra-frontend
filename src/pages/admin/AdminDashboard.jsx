import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Pagination } from 'react-bootstrap';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';
import { FaEye, FaUserShield, FaUser, FaCoins, FaTrash, FaSync, FaCog, FaBullhorn, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  // Settings states
  const [settings, setSettings] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers({ 
          search: search || undefined, 
          page: currentPage, 
          limit: itemsPerPage 
        }),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      
      // Pagination bilgilerini güncelle
      if (usersRes.data.pagination) {
        setTotalPages(usersRes.data.pagination.totalPages);
        setTotalItems(usersRes.data.pagination.total);
      }
    } catch (error) {
      console.error('Fetch data error:', error);
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await adminApi.getSettings();
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Fetch settings error:', error);
    }
  };

  const handleToggleSetting = async (settingKey, currentValue) => {
    try {
      await adminApi.updateSetting(settingKey, !currentValue);
      toast.success('Ayar güncellendi');
      fetchSettings();
    } catch (error) {
      console.error('Update setting error:', error);
      toast.error('Ayar güncellenemedi');
    }
  };

  const handleConfirmPrintNest = async (userId) => {
    try {
      await adminApi.confirmPrintNest(userId);
      toast.success('PrintNest kaydı onaylandı');
      fetchData();
    } catch (error) {
      console.error('Confirm error:', error);
      toast.error('Onaylama başarısız');
    }
  };

  const handleSyncToSheets = async () => {
    setSyncing(true);
    try {
      const response = await adminApi.syncToSheets();
      toast.success(response.message || 'Google Sheets senkronize edildi');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(error.response?.data?.message || 'Senkronizasyon başarısız');
    } finally {
      setSyncing(false);
    }
  };

  const handleImportFromSheets = async () => {
    setImporting(true);
    try {
      const response = await adminApi.importFromSheets();
      toast.success(response.message || 'Google Sheets\'ten içe aktarma tamamlandı');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error.response?.data?.message || 'İçe aktarma başarısız');
    } finally {
      setImporting(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1); // Aramada ilk sayfaya dön
    fetchData();
  };

  const handleClearSearch = async () => {
    setSearch('');
    setCurrentPage(1);
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers({ 
          page: 1, 
          limit: itemsPerPage 
        }),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      
      if (usersRes.data.pagination) {
        setTotalPages(usersRes.data.pagination.totalPages);
        setTotalItems(usersRes.data.pagination.total);
      }
    } catch (error) {
      console.error('Clear search error:', error);
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
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
      console.error('View user error:', error);
      toast.error('Kullanıcı detayları yüklenemedi');
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleUpdateRole = async (newRole) => {
    try {
      await adminApi.updateUserRole(selectedUser.id, newRole);
      const roleNames = {
        admin: 'Admin',
        user: 'Kullanıcı',
        support: 'Destek'
      };
      toast.success(`Kullanıcı rolü ${roleNames[newRole]} olarak güncellendi`);
      setShowRoleModal(false);
      fetchData();
    } catch (error) {
      console.error('Role update error:', error);
      toast.error('Rol güncellenemedi');
    }
  };

  const handleOpenTokenModal = (user) => {
    setSelectedUser(user);
    setTokenAmount(user.dailyTokens || 0);
    setShowTokenModal(true);
  };

  const handleUpdateTokens = async () => {
    try {
      await adminApi.updateUserTokens(selectedUser.id, tokenAmount);
      toast.success('Token miktarı güncellendi');
      setShowTokenModal(false);
      fetchData();
    } catch (error) {
      console.error('Token update error:', error);
      toast.error('Token güncellenemedi');
    }
  };

  const handleResetTokens = async (userId) => {
    try {
      await adminApi.resetUserTokens(userId);
      toast.success('Tokenler sıfırlandı (40)');
      fetchData();
    } catch (error) {
      console.error('Token reset error:', error);
      toast.error('Token sıfırlanamadı');
    }
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await adminApi.deleteUser(userToDelete.id);
      toast.success('Kullanıcı silindi');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Kullanıcı silinemedi');
      }
    }
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
        <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />
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
        <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />
      );
    }

    // Son sayfa
    if (endPage < totalPages) {
      items.push(
        <Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} />
      );
    }

    return <Pagination className="mb-0">{items}</Pagination>;
  };

  if (loading && currentPage === 1) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2>🛡️ Admin Panel</h2>
              <p className="mb-0">Kullanıcı yönetimi ve istatistikler</p>
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
              <div className="stats-icon primary">👥</div>
              <div className="stats-value">{stats?.totalUsers || 0}</div>
              <div className="stats-label">Toplam Kullanıcı</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon success">✅</div>
              <div className="stats-value">{stats?.confirmedUsers || 0}</div>
              <div className="stats-label">Onaylı Kullanıcı</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon info">📊</div>
              <div className="stats-value">{stats?.totalSessions || 0}</div>
              <div className="stats-label">Toplam Oturum</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon warning">🆕</div>
              <div className="stats-value">{stats?.todaySessions || 0}</div>
              <div className="stats-label">Bugünkü Oturum</div>
            </div>
          </Col>
        </Row>

        {/* System Settings */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">⚙️ Sistem Ayarları</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <FaCog className="me-2" />
                    Tüm Ayarlar
                  </Button>
                </div>
                
                {settings && (
                  <div className="d-flex gap-4 flex-wrap">
                    {/* PrintNest Default Setting */}
                    <div className="d-flex align-items-center gap-2">
                      <Form.Check 
                        type="switch"
                        id="default-printnest-switch"
                        checked={settings.default_printnest_confirmed?.value || false}
                        onChange={() => handleToggleSetting(
                          'default_printnest_confirmed', 
                          settings.default_printnest_confirmed?.value
                        )}
                      />
                      <label htmlFor="default-printnest-switch" style={{ cursor: 'pointer' }}>
                        <strong>Yeni kullanıcılar varsayılan olarak PrintNest onaylı gelsin</strong>
                        <div className="text-muted small">
                          {settings.default_printnest_confirmed?.value ? 
                            '✅ Aktif - Yeni kullanıcılar otomatik onaylı' : 
                            '❌ Pasif - Yeni kullanıcılar manuel onay bekleyecek'}
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Actions */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <h5 className="mb-3">📊 Google Sheets Senkronizasyonu</h5>
                <p className="text-muted small mb-3">
                  <strong>Çift yönlü senkronizasyon:</strong> Database ve Google Sheets arasında kullanıcı verilerini senkronize edin.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <div>
                    <Button
                      variant="primary"
                      onClick={handleSyncToSheets}
                      disabled={syncing || importing}
                      className="mb-2"
                    >
                      {syncing ? 'Senkronize Ediliyor...' : '📤 Database → Sheets'}
                    </Button>
                    <div className="text-muted small">
                      Database'deki yeni kullanıcıları Sheet'e ekler
                    </div>
                  </div>
                  
                  <div>
                    <Button
                      variant="success"
                      onClick={handleImportFromSheets}
                      disabled={syncing || importing}
                      className="mb-2"
                    >
                      {importing ? 'İçe Aktarılıyor...' : '📥 Sheets → Database'}
                    </Button>
                    <div className="text-muted small">
                      Sheet'teki yeni kullanıcıları Database'e ekler<br />
                      <em className="text-info">Bu kullanıcılar "Şifremi Unuttum" ile giriş yapabilir</em>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Users Table */}
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div>
                    <h5 className="mb-1">Kullanıcılar</h5>
                    <small className="text-muted">
                      Toplam {totalItems} kullanıcı - Sayfa {currentPage} / {totalPages}
                    </small>
                  </div>
                  
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    {/* Sayfa başına öğe sayısı */}
                    <Form.Select 
                      size="sm" 
                      value={itemsPerPage} 
                      onChange={handleItemsPerPageChange}
                      style={{ width: 'auto' }}
                    >
                      <option value={10}>10 / sayfa</option>
                      <option value={20}>20 / sayfa</option>
                      <option value={50}>50 / sayfa</option>
                    </Form.Select>

                    {/* Arama */}
                    <Form onSubmit={handleSearch} className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Kullanıcı ara (tüm listede)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '250px' }}
                        size="sm"
                      />
                      <Button type="submit" variant="primary" size="sm" disabled={loading}>
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

                {loading && currentPage > 1 ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Ad Soyad</th>
                          <th>E-posta</th>
                          <th>Rol</th>
                          <th>Tokenler</th>
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
                                <Badge bg="danger" className="ms-2" style={{ fontSize: '0.65rem' }}>
                                  SUPER ADMIN
                                </Badge>
                              )}
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <Badge bg={
                                user.role === 'admin' ? 'primary' : 
                                user.role === 'support' ? 'info' : 
                                'secondary'
                              }>
                                {user.role === 'admin' ? 'Admin' : 
                                 user.role === 'support' ? 'Destek' : 
                                 'Kullanıcı'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg="warning" text="dark">
                                {user.dailyTokens || 0} Token
                              </Badge>
                            </td>
                            <td>
                              {user.printNestConfirmed ? (
                                <Badge bg="success">Onaylı</Badge>
                              ) : (
                                <Badge bg="warning" text="dark">Bekliyor</Badge>
                              )}
                            </td>
                            <td>{new Date(user.registeredAt).toLocaleDateString('tr-TR')}</td>
                            <td>
                              <div className="d-flex gap-1 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="info"
                                  onClick={() => handleViewUser(user.id)}
                                  title="Detayları Gör"
                                >
                                  <FaEye />
                                </Button>
                                
                                {!user.isSuperAdmin && (
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => handleOpenRoleModal(user)}
                                    title="Rol Değiştir"
                                  >
                                    <FaUserShield />
                                  </Button>
                                )}

                                <Button
                                  size="sm"
                                  variant="warning"
                                  onClick={() => handleOpenTokenModal(user)}
                                  title="Token Yönet"
                                >
                                  <FaCoins />
                                </Button>

                                {!user.printNestConfirmed && (
                                  <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleConfirmPrintNest(user.id)}
                                    title="PrintNest Onayla"
                                  >
                                    ✓
                                  </Button>
                                )}

                                {!user.isSuperAdmin && (
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
                        {search ? 'Arama sonucu kullanıcı bulunamadı' : 'Kullanıcı bulunamadı'}
                      </p>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                        <small className="text-muted">
                          Gösterilen: {users.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
                        </small>
                        {renderPagination()}
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* User Detail Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Kullanıcı Detayları</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <h5>{selectedUser.firstName} {selectedUser.lastName}</h5>
              <p className="text-muted mb-3">{selectedUser.email}</p>
              
              <Row>
                <Col md={6}>
                  <p><strong>Rol:</strong>{' '}
                    <Badge bg={
                      selectedUser.role === 'admin' ? 'primary' : 
                      selectedUser.role === 'support' ? 'info' : 
                      'secondary'
                    }>
                      {selectedUser.role === 'admin' ? 'Admin' : 
                       selectedUser.role === 'support' ? 'Destek' : 
                       'Kullanıcı'}
                    </Badge>
                  </p>
                  <p><strong>Telefon:</strong> {selectedUser.phoneNumber || '-'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Günlük Token:</strong> {selectedUser.dailyTokens || 0}</p>
                  <p><strong>PrintNest:</strong> {selectedUser.printNestConfirmed ? 'Onaylı' : 'Bekliyor'}</p>
                  <p><strong>Abonelik:</strong> {selectedUser.hasActiveSubscription ? 'Aktif' : 'Pasif'}</p>
                </Col>
              </Row>

              {/* Etsy Mağazaları */}
              {selectedUser.etsyStores && selectedUser.etsyStores.length > 0 && (
                <>
                  <hr />
                  <h6>Etsy Mağazaları ({selectedUser.etsyStores.length})</h6>
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
                                <a href={store.storeUrl} target="_blank" rel="noopener noreferrer" className="text-muted small">
                                  {store.storeUrl}
                                </a>
                              </>
                            ) : (
                              <a href={store.storeUrl} target="_blank" rel="noopener noreferrer">
                                {store.storeUrl}
                              </a>
                            )}
                          </td>
                          <td>{new Date(store.createdAt).toLocaleDateString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
              
              {(!selectedUser.etsyStores || selectedUser.etsyStores.length === 0) && (
                <>
                  <hr />
                  <p className="text-muted"><strong>Etsy Mağazaları:</strong> Henüz mağaza eklenmemiş</p>
                </>
              )}

              <hr />
              
              <p><strong>Kayıt Tarihi:</strong> {new Date(selectedUser.registeredAt).toLocaleString('tr-TR')}</p>
              <p><strong>Son Token Sıfırlama:</strong> {new Date(selectedUser.lastTokenReset).toLocaleString('tr-TR')}</p>
              
              {selectedUser.printNestSessions && selectedUser.printNestSessions.length > 0 && (
                <>
                  <hr />
                  <h6>Son PrintNest Oturumları</h6>
                  <Table size="sm" striped>
                    <thead>
                      <tr>
                        <th>Açılış</th>
                        <th>Kapanış</th>
                        <th>Süre (dk)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.printNestSessions.slice(0, 5).map((session, idx) => (
                        <tr key={idx}>
                          <td>{new Date(session.iframeOpenedAt).toLocaleString('tr-TR')}</td>
                          <td>{session.iframeClosedAt ? new Date(session.iframeClosedAt).toLocaleString('tr-TR') : 'Açık'}</td>
                          <td>{session.totalTimeSpent ? Math.round(session.totalTimeSpent / 60) : '-'}</td>
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

      {/* Token Management Modal */}
      <Modal show={showTokenModal} onHide={() => setShowTokenModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Token Yönetimi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Kullanıcı:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Mevcut Token:</strong> {selectedUser.dailyTokens || 0}</p>
              
              <Form.Group className="mb-3">
                <Form.Label>Yeni Token Miktarı</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(parseInt(e.target.value) || 0)}
                />
              </Form.Group>

              <div className="d-flex gap-2 mb-3">
                <Button 
                  size="sm" 
                  variant="outline-secondary"
                  onClick={() => setTokenAmount(40)}
                >
                  40 (Varsayılan)
                </Button>
                <Button 
                  size="sm" 
                  variant="outline-secondary"
                  onClick={() => setTokenAmount(100)}
                >
                  100
                </Button>
                <Button 
                  size="sm" 
                  variant="outline-secondary"
                  onClick={() => setTokenAmount(500)}
                >
                  500
                </Button>
                <Button 
                  size="sm" 
                  variant="outline-secondary"
                  onClick={() => setTokenAmount(1000)}
                >
                  1000
                </Button>
              </div>

              <Button 
                variant="warning" 
                size="sm"
                onClick={() => handleResetTokens(selectedUser.id)}
                className="w-100"
              >
                <FaSync className="me-2" />
                Varsayılana Sıfırla (40)
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTokenModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdateTokens}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Role Change Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kullanıcı Rolü Değiştir</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>
                <strong>Kullanıcı:</strong> {selectedUser.firstName} {selectedUser.lastName}
                <br />
                <strong>E-posta:</strong> {selectedUser.email}
                <br />
                <strong>Mevcut Rol:</strong>{' '}
                <Badge bg={
                  selectedUser.role === 'admin' ? 'primary' : 
                  selectedUser.role === 'support' ? 'info' : 
                  'secondary'
                }>
                  {selectedUser.role === 'admin' ? 'Admin' : 
                   selectedUser.role === 'support' ? 'Destek' : 
                   'Kullanıcı'}
                </Badge>
              </p>
              
              <hr />
              
              <p className="mb-3"><strong>Yeni rol seçin:</strong></p>
              
              <div className="d-grid gap-2">
                <Button
                  variant={selectedUser.role === 'user' ? 'secondary' : 'outline-secondary'}
                  size="lg"
                  onClick={() => handleUpdateRole('user')}
                  disabled={selectedUser.role === 'user'}
                >
                  <FaUser className="me-2" />
                  Kullanıcı
                  {selectedUser.role === 'user' && ' (Mevcut)'}
                </Button>
                
                <Button
                  variant={selectedUser.role === 'support' ? 'info' : 'outline-info'}
                  size="lg"
                  onClick={() => handleUpdateRole('support')}
                  disabled={selectedUser.role === 'support'}
                >
                  <FaUserShield className="me-2" />
                  Destek
                  {selectedUser.role === 'support' && ' (Mevcut)'}
                  <div className="small text-muted">
                    Kullanıcıları görüntüleyebilir, bildirim oluşturabilir
                  </div>
                </Button>
                
                <Button
                  variant={selectedUser.role === 'admin' ? 'primary' : 'outline-primary'}
                  size="lg"
                  onClick={() => handleUpdateRole('admin')}
                  disabled={selectedUser.role === 'admin'}
                >
                  <FaUserShield className="me-2" />
                  Admin
                  {selectedUser.role === 'admin' && ' (Mevcut)'}
                  <div className="small text-muted">
                    Tam yetki - tüm özelliklere erişim
                  </div>
                </Button>
              </div>
              
              <div className="alert alert-info mt-3 mb-0 small">
                <FaInfoCircle className="me-2" />
                <strong>Not:</strong> Rol değişiklikleri anında uygulanır. Kullanıcı tekrar giriş yapması gerekmez.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            İptal
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
            <p>
              <strong>{userToDelete.firstName} {userToDelete.lastName}</strong> ({userToDelete.email}) 
              kullanıcısını silmek istediğinizden emin misiniz?
              <br />
              <br />
              <span className="text-danger">Bu işlem geri alınamaz!</span>
            </p>
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

      {/* Settings Modal */}
      <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>⚙️ Sistem Ayarları</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {settings && (
            <div>
              <Table hover>
                <thead>
                  <tr>
                    <th>Ayar</th>
                    <th>Açıklama</th>
                    <th>Değer</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(settings).map(([key, setting]) => (
                    <tr key={key}>
                      <td><strong>{key}</strong></td>
                      <td className="text-muted small">{setting.description}</td>
                      <td>
                        {setting.type === 'boolean' ? (
                          <Form.Check 
                            type="switch"
                            id={`setting-${key}`}
                            checked={setting.value}
                            onChange={() => handleToggleSetting(key, setting.value)}
                          />
                        ) : (
                          <span>{setting.value}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>
            Kapat
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

import { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { aiApi } from '../../../api/aiApi';
import { toast } from 'react-toastify';
import TokenDisplay from '../../../components/common/TokenDisplay';
import useAuthStore from '../../../store/authStore';

const RemoveBackgroundPage = () => {
  const { setTokensFromResponse } = useAuthStore();
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        toast.error('Lütfen bir görsel dosyası seçin');
        return;
      }

      // Önizleme için dosyayı oku
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage({
          file: file,
          preview: reader.result
        });
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) {
      toast.error('Lütfen önce bir görsel yükleyin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await aiApi.removeBackground(originalImage.file);
      setProcessedImage(response.data.image);
      setTokensFromResponse(response.data.remainingTokens);
      toast.success(response.message || 'Arka plan başarıyla kaldırıldı!');
    } catch (err) {
      console.error('Remove background error:', err);
      const errorMessage = err.response?.data?.message || 'Arka plan kaldırma başarısız oldu';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!processedImage) return;

    try {
      // Base64 görseli direkt indir
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `removed-bg-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Görsel indirildi!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Görsel indirilirken bir hata oluştu');
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="dashboard-container etsy-ai-container">
      <Container fluid className="main-content">
        <div className="page-header-wrapper">
          <div className="page-header">
            <h2>🖼️ Arka Plan Kaldırma</h2>
            <p>Görselin arka planını otomatik kaldır</p>
          </div>
          <TokenDisplay />
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Row>
          {/* Upload Section */}
          <Col lg={12} className="mb-4">
            <Card>
              <Card.Body>
                <h5 className="mb-3">1. Görsel Yükle</h5>
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      as="span"
                      variant="primary"
                      size="lg"
                      style={{ cursor: 'pointer' }}
                    >
                      📁 Görsel Seç
                    </Button>
                  </label>
                  <p className="text-muted mt-2 mb-0">
                    PNG, JPG, WEBP formatları desteklenir (Max 10MB)
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Original Image */}
          {originalImage && (
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Orijinal Görsel</h6>
                </Card.Header>
                <Card.Body className="text-center">
                  <img
                    src={originalImage.preview}
                    alt="Original"
                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                  />
                  <div className="mt-3">
                    <Button
                      variant="primary"
                      onClick={handleRemoveBackground}
                      disabled={loading}
                      className="me-2"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          İşleniyor...
                        </>
                      ) : (
                        '✨ Arka Planı Kaldır'
                      )}
                    </Button>
                    <Button variant="outline-secondary" onClick={handleReset}>
                      🔄 Yeni Görsel
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Processed Image */}
          {processedImage && (
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h6 className="mb-0">İşlenmiş Görsel</h6>
                </Card.Header>
                <Card.Body className="text-center">
                  <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
                    <img
                      src={processedImage}
                      alt="Processed"
                      style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="success"
                      onClick={handleDownload}
                      size="lg"
                    >
                      ⬇️ İndir (PNG)
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Loading State */}
          {loading && !processedImage && (
            <Col lg={12}>
              <Card>
                <Card.Body className="loading-spinner text-center py-5">
                  <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                  <p className="mt-3 text-muted">AI arka planı kaldırıyor, lütfen bekleyin...</p>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Info Section */}
        {!originalImage && (
          <Row className="mt-4">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <h6 className="mb-3">ℹ️ Nasıl Kullanılır?</h6>
                  <Row>
                    <Col md={4}>
                      <div className="mb-3">
                        <strong>1️⃣ Görsel Yükle</strong>
                        <p className="text-muted small mb-0">
                          Arka planını kaldırmak istediğiniz görseli seçin.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <strong>2️⃣ İşle</strong>
                        <p className="text-muted small mb-0">
                          "Arka Planı Kaldır" butonuna tıklayın. AI otomatik işleyecek.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <strong>3️⃣ İndir</strong>
                        <p className="text-muted small mb-0">
                          Sonucu beğendiyseniz PNG formatında indirin.
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default RemoveBackgroundPage;


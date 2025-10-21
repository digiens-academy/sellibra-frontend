import { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { aiApi } from '../../../api/aiApi';
import TokenDisplay from '../../../components/common/TokenDisplay';
import useAuthStore from '../../../store/authStore';

const ImageToImagePage = () => {
  const { setTokensFromResponse } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [operationType, setOperationType] = useState('remove-object');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // İşlem türleri
  const operationTypes = [
    { 
      value: 'remove-object', 
      label: '🎯 Nesne Kaldırma',
      desc: 'Tasarımdaki istenmeyen bir nesneyi kaldırın',
      requiresPrompt: true
    },
    { 
      value: 'style-transfer', 
      label: '🎨 Stil Değiştirme',
      desc: 'Tasarımın stilini değiştir',
      requiresPrompt: true
    },
    { 
      value: 'color-change', 
      label: '🌈 Renk Düzenleme',
      desc: 'Renk paletini değiştir',
      requiresPrompt: true
    },
    { 
      value: 'enhance', 
      label: '✨ İyileştirme (300 DPI)',
      desc: 'Görseli basım kalitesinde 300 DPI\'ya yükselt',
      requiresPrompt: false
    }
  ];

  // Nesne kaldırma önerileri
  const removeObjectPrompts = [
    'Arka plandaki logoyu kaldır',
    'Su damgasını/watermark\'ı kaldır',
    'İstenmeyen metni çıkar',
    'Arka plandaki kişileri kaldır',
    'Gereksiz objeleri temizle'
  ];

  // Stil önerileri
  const stylePrompts = [
    'Minimalist ve modern bir stile dönüştür',
    'Vintage ve retro tarz uygula',
    'Grunge ve yıpranmış görünüm ekle',
    'Karikatür stiline çevir',
    'Geometrik ve soyut hale getir',
    'Watercolor (sulu boya) efekti ekle'
  ];

  // Renk önerileri
  const colorPrompts = [
    'Monokrom siyah-beyaz tonlara dönüştür',
    'Pastel renklere çevir',
    'Canlı ve parlak renkler kullan',
    'Toprak tonlarına dönüştür',
    'Neon renkler ekle',
    'Soğuk tonlar (mavi, mor) kullan'
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya türü kontrolü
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir görsel dosyası seçin');
        return;
      }

      // Dosya boyutu kontrolü (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan küçük olmalıdır');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setProcessedImage(null);
      setSuccess(false);

      // Önizleme oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOperationChange = (type) => {
    setOperationType(type);
    setPrompt('');
    setProcessedImage(null);
    setError(null);
    setSuccess(false);
  };

  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
  };

  const buildEnhancedPrompt = () => {
    let enhancedPrompt = prompt;

    if (operationType === 'remove-object') {
      enhancedPrompt += ', remove the object cleanly without damaging the rest of the design, maintain quality';
    } else if (operationType === 'style-transfer') {
      enhancedPrompt += ', maintain the main design elements, t-shirt design style, clean and professional';
    } else if (operationType === 'color-change') {
      enhancedPrompt += ', keep the original design structure, only change colors, t-shirt design';
    } else if (operationType === 'enhance') {
      enhancedPrompt = 'upscale to 300 DPI print quality, enhance sharpness and clarity, maintain original design, professional print ready, high resolution';
    }

    return enhancedPrompt;
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError('Lütfen bir görsel yükleyin');
      return;
    }

    const currentOperation = operationTypes.find(op => op.value === operationType);
    if (currentOperation?.requiresPrompt && !prompt.trim()) {
      setError('Lütfen yapılmasını istediğiniz değişikliği açıklayın');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setProcessedImage(null);

    try {
      // Image-to-Image işlemleri
      const enhancedPrompt = buildEnhancedPrompt();
      const response = await aiApi.imageToImage(selectedFile, enhancedPrompt, {
        size: '1024x1024'
      });
      setProcessedImage(response.data.url);
      setTokensFromResponse(response.data.remainingTokens);
      setSuccess(true);
    } catch (err) {
      console.error('Image processing error:', err);
      setError(err.response?.data?.message || 'Görsel işlenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (processedImage) {
      try {
        // Backend proxy üzerinden indir (CORS sorunu çözümü)
        await aiApi.downloadImage(processedImage, `processed-design-${Date.now()}.png`);
      } catch (error) {
        console.error('Download error:', error);
        setError(error.response?.data?.message || 'Görsel indirilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImage(null);
    setPrompt('');
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentPrompts = () => {
    switch (operationType) {
      case 'remove-object':
        return removeObjectPrompts;
      case 'style-transfer':
        return stylePrompts;
      case 'color-change':
        return colorPrompts;
      default:
        return [];
    }
  };

  const currentOperation = operationTypes.find(op => op.value === operationType);

  return (
    <div className="dashboard-container etsy-ai-container">
      <Container fluid className="main-content">
        <div className="page-header-wrapper">
          <div className="page-header">
            <h2>🔄 Image-to-Image - Tasarım Düzenleme</h2>
            <p>Mevcut tasarımlarınızı AI ile geliştirin ve düzenleyin</p>
          </div>
          <TokenDisplay />
        </div>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
            İşlem başarıyla tamamlandı! 🎉
          </Alert>
        )}

        <Row>
          <Col lg={8}>
            {/* Dosya Yükleme */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">📤 Görsel Yükleme</h5>
                <Form.Group className="mb-3">
                  <div 
                    className="border rounded p-4 text-center"
                    style={{ 
                      borderStyle: 'dashed',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {!previewUrl ? (
                      <>
                        <div style={{ fontSize: '3rem' }} className="mb-3">
                          📁
                        </div>
                        <p className="mb-2">Tıklayın veya dosyayı sürükleyip bırakın</p>
                        <small className="text-muted">PNG, JPG, JPEG (Max: 10MB)</small>
                      </>
                    ) : (
                      <div>
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          style={{ maxWidth: '100%', maxHeight: '300px' }}
                          className="rounded"
                        />
                        <p className="mt-2 mb-0">
                          <small className="text-muted">{selectedFile?.name}</small>
                        </p>
                      </div>
                    )}
                  </div>
                  <Form.Control
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="d-none"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* İşlem Türü Seçimi */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">⚙️ İşlem Türü</h5>
                <Row>
                  {operationTypes.map((type) => (
                    <Col md={6} key={type.value} className="mb-3">
                      <Card
                        className={`h-100 ${operationType === type.value ? 'border-primary bg-light' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOperationChange(type.value)}
                      >
                        <Card.Body className="p-3">
                          <div className="fw-bold mb-2">{type.label}</div>
                          <small className="text-muted">{type.desc}</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Prompt Girişi (gerekli işlemler için) */}
            {currentOperation?.requiresPrompt && (
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">✍️ Değişiklik Açıklaması</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Ne tür bir değişiklik istiyorsunuz?</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Örn: Tasarımı vintage bir stile dönüştür, kahverengi tonlar kullan..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      Detaylı açıklama yapın, böylece daha iyi sonuç alırsınız.
                    </Form.Text>
                  </Form.Group>

                  {/* Örnek Promptlar */}
                  {getCurrentPrompts().length > 0 && (
                    <div>
                      <h6 className="mb-2">💡 Öneri Örnekleri</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {getCurrentPrompts().map((examplePrompt, index) => (
                          <Button
                            key={index}
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handlePromptSelect(examplePrompt)}
                          >
                            {examplePrompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* İşlem Açıklaması */}
            <Card className="mb-4 bg-light">
              <Card.Body>
                <h6 className="mb-2">ℹ️ {currentOperation?.label}</h6>
                <p className="mb-0 small">{currentOperation?.desc}</p>
                {operationType === 'remove-object' && (
                  <ul className="small mt-2 mb-0">
                    <li>Tasarımdaki istenmeyen bir nesneyi kaldırır</li>
                    <li>Kaldırmak istediğiniz nesneyi açıkça belirtin</li>
                    <li>AI, nesneyi temiz bir şekilde çıkarır</li>
                    <li>Tasarımın geri kalanı korunur</li>
                  </ul>
                )}
                {operationType === 'enhance' && (
                  <ul className="small mt-2 mb-0">
                    <li>Görseli 300 DPI basım kalitesine yükseltir</li>
                    <li>Keskinlik ve netlik artırılır</li>
                    <li>Profesyonel basım için hazır hale gelir</li>
                    <li>Orijinal tasarım korunur</li>
                  </ul>
                )}
              </Card.Body>
            </Card>

            {/* Aksiyonlar */}
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProcess}
                disabled={loading || !selectedFile}
                className="flex-grow-1"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    İşleniyor...
                  </>
                ) : (
                  '✨ İşlemi Başlat'
                )}
              </Button>
              <Button variant="outline-secondary" onClick={handleReset}>
                🔄 Sıfırla
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            {/* Önizleme */}
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h5 className="mb-3">🖼️ Sonuç Önizleme</h5>
                
                {!processedImage && !loading && (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem' }} className="mb-3">
                      🎨
                    </div>
                    <p className="text-muted">
                      İşlenmiş görseliniz burada görünecek
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted">AI görselinizi işliyor...</p>
                    <small className="text-muted">Bu işlem 10-30 saniye sürebilir</small>
                  </div>
                )}

                {processedImage && (
                  <>
                    <div className="mb-3">
                      <img
                        src={processedImage}
                        alt="Processed Design"
                        className="img-fluid rounded"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <Button
                      variant="success"
                      className="w-100"
                      onClick={handleDownload}
                    >
                      ⬇️ İndir
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* İpuçları */}
            <Card className="mt-4">
              <Card.Body>
                <h6 className="mb-3">💡 İpuçları</h6>
                <ul className="small mb-0">
                  <li className="mb-2">En iyi sonuç için yüksek kaliteli görseller kullanın</li>
                  <li className="mb-2">Nesne kaldırma için hangi nesneyi kaldırmak istediğinizi açıkça belirtin</li>
                  <li className="mb-2">İyileştirme özelliği görseli 300 DPI basım kalitesine çevirir</li>
                  <li className="mb-2">Değişikliklerinizi detaylı açıklayın</li>
                  <li className="mb-0">Farklı işlem türlerini deneyerek en iyisini bulun</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ImageToImagePage;


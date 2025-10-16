import { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { aiApi } from '../../../api/aiApi';
import TokenDisplay from '../../../components/common/TokenDisplay';
import useAuthStore from '../../../store/authStore';

const MockupGeneratorPage = () => {
  const { setTokensFromResponse } = useAuthStore();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [uploadedDesign, setUploadedDesign] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mockupResult, setMockupResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Ürün tipleri
  const productTypes = [
    { 
      value: 't-shirt', 
      label: '👕 T-Shirt', 
      desc: 'Klasik Tişört',
      icon: '👕',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    { 
      value: 'hoodie', 
      label: '🧥 Hoodie', 
      desc: 'Kapüşonlu Sweatshirt',
      icon: '🧥',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    { 
      value: 'tank-top', 
      label: '🎽 Tank Top', 
      desc: 'Kolsuz Atlet',
      icon: '🎽',
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    { 
      value: 'long-sleeve', 
      label: '👔 Long Sleeve', 
      desc: 'Uzun Kollu Tişört',
      icon: '👔',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    { 
      value: 'sweatshirt', 
      label: '🧵 Sweatshirt', 
      desc: 'Klasik Sweatshirt',
      icon: '🧵',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    { 
      value: 'mug', 
      label: '☕ Mug', 
      desc: 'Kahve Kupası',
      icon: '☕',
      sizes: ['11oz', '15oz']
    },
    { 
      value: 'tote-bag', 
      label: '👜 Tote Bag', 
      desc: 'Bez Çanta',
      icon: '👜',
      sizes: ['Standard']
    },
    { 
      value: 'phone-case', 
      label: '📱 Phone Case', 
      desc: 'Telefon Kılıfı',
      icon: '📱',
      sizes: ['iPhone', 'Samsung']
    }
  ];

  // Renk seçenekleri
  const colorOptions = [
    { value: 'white', label: 'Beyaz', hex: '#FFFFFF', border: true },
    { value: 'black', label: 'Siyah', hex: '#000000' },
    { value: 'navy', label: 'Lacivert', hex: '#001f3f' },
    { value: 'gray', label: 'Gri', hex: '#808080' },
    { value: 'red', label: 'Kırmızı', hex: '#FF4136' },
    { value: 'blue', label: 'Mavi', hex: '#0074D9' },
    { value: 'green', label: 'Yeşil', hex: '#2ECC40' },
    { value: 'yellow', label: 'Sarı', hex: '#FFDC00' },
    { value: 'pink', label: 'Pembe', hex: '#FF69B4' },
    { value: 'purple', label: 'Mor', hex: '#B10DC9' },
    { value: 'orange', label: 'Turuncu', hex: '#FF851B' },
    { value: 'brown', label: 'Kahverengi', hex: '#8B4513' }
  ];

  // Dosya yükleme
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya kontrolü
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Lütfen geçerli bir görsel dosyası yükleyin (PNG, JPG, WEBP)');
        return;
      }

      // Dosya boyutu kontrolü (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan küçük olmalıdır');
        return;
      }

      setUploadedDesign(file);
      setError(null);

      // Önizleme oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesignPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (validTypes.includes(file.type)) {
        const mockEvent = { target: { files: [file] } };
        handleFileSelect(mockEvent);
      } else {
        setError('Lütfen geçerli bir görsel dosyası yükleyin (PNG, JPG, WEBP)');
      }
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const validateForm = () => {
    if (!selectedProduct) {
      setError('Lütfen bir ürün seçin');
      return false;
    }
    if (!selectedColor) {
      setError('Lütfen bir renk seçin');
      return false;
    }
    if (!uploadedDesign) {
      setError('Lütfen tasarımınızı yükleyin');
      return false;
    }
    return true;
  };

  const handleGenerateMockup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setMockupResult(null);

    try {
      // AI ile gerçek mockup oluştur
      const response = await aiApi.generateMockup(
        uploadedDesign,
        selectedProduct,
        selectedColor,
        {
          size: '1024x1024'
        }
      );
      
      setMockupResult({
        imageUrl: response.data.image,
        mockupUrl: response.data.mockupUrl,
        revisedPrompt: response.data.revisedPrompt,
        productType: selectedProduct,
        color: selectedColor,
        timestamp: new Date().toISOString()
      });
      
      setTokensFromResponse(response.data.remainingTokens);
      setSuccess(true);
    } catch (err) {
      console.error('Mockup generation error:', err);
      setError(err.response?.data?.message || 'Mockup oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (mockupResult) {
      const link = document.createElement('a');
      link.href = mockupResult.imageUrl;
      link.download = `mockup-${selectedProduct}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setSelectedProduct('');
    setSelectedColor('');
    setUploadedDesign(null);
    setDesignPreview(null);
    setMockupResult(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedProductData = productTypes.find(p => p.value === selectedProduct);
  const selectedColorData = colorOptions.find(c => c.value === selectedColor);

  return (
    <div className="dashboard-container etsy-ai-container">
      <Container fluid className="main-content">
        <div className="page-header-wrapper">
          <div className="page-header">
            <h2>👕 Mockup Oluşturucu</h2>
            <p>Tasarımınızı gerçek ürünler üzerinde görüntüleyin</p>
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
            Mockup başarıyla oluşturuldu! 🎉
          </Alert>
        )}

        <Row>
          <Col lg={8}>
            {/* Ürün Seçimi */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">1️⃣ Ürün Seçimi</h5>
                <Row>
                  {productTypes.map((product) => (
                    <Col md={3} sm={6} key={product.value} className="mb-3">
                      <Card
                        className={`text-center h-100 ${selectedProduct === product.value ? 'border-primary border-2' : ''}`}
                        style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                        onClick={() => handleProductSelect(product.value)}
                      >
                        <Card.Body className="p-3">
                          <div style={{ fontSize: '2.5rem' }} className="mb-2">
                            {product.icon}
                          </div>
                          <div className="fw-bold mb-1">{product.desc}</div>
                          <small className="text-muted">
                            {product.sizes.length} beden
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {selectedProduct && (
                  <div className="mt-3">
                    <Badge bg="success">
                      ✓ Seçilen: {selectedProductData?.desc}
                    </Badge>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Renk Seçimi */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">2️⃣ Renk Seçimi</h5>
                <Row>
                  {colorOptions.map((color) => (
                    <Col md={2} sm={3} xs={4} key={color.value} className="mb-3">
                      <div
                        className={`text-center ${selectedColor === color.value ? 'border-primary border-3' : 'border'}`}
                        style={{ 
                          cursor: 'pointer', 
                          borderRadius: '8px',
                          padding: '10px',
                          transition: 'all 0.3s',
                          border: selectedColor === color.value ? '3px solid #0d6efd' : '1px solid #ddd'
                        }}
                        onClick={() => handleColorSelect(color.value)}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '60px',
                            backgroundColor: color.hex,
                            borderRadius: '6px',
                            border: color.border ? '1px solid #ddd' : 'none',
                            marginBottom: '8px'
                          }}
                        />
                        <small className="fw-bold">{color.label}</small>
                      </div>
                    </Col>
                  ))}
                </Row>
                {selectedColor && (
                  <div className="mt-3">
                    <Badge bg="success">
                      ✓ Seçilen: {selectedColorData?.label}
                    </Badge>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Tasarım Yükleme */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">3️⃣ Tasarım Yükleme</h5>
                
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    padding: '40px',
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!designPreview ? (
                    <>
                      <div style={{ fontSize: '3rem' }} className="mb-3">📁</div>
                      <h6>Tasarımınızı sürükleyip bırakın</h6>
                      <p className="text-muted mb-3">veya</p>
                      <Button variant="outline-primary">
                        Dosya Seç
                      </Button>
                      <p className="text-muted small mt-3 mb-0">
                        PNG, JPG veya WEBP formatında • Maksimum 10MB
                      </p>
                    </>
                  ) : (
                    <div>
                      <img
                        src={designPreview}
                        alt="Design Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          borderRadius: '8px',
                          marginBottom: '15px'
                        }}
                      />
                      <div className="d-flex gap-2 justify-content-center">
                        <Badge bg="success">✓ Tasarım Yüklendi</Badge>
                        <Button 
                          size="sm" 
                          variant="outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                          }}
                        >
                          Değiştir
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                <div className="mt-3">
                  <h6 className="mb-2">💡 Tasarım İpuçları</h6>
                  <ul className="small text-muted mb-0">
                    <li>Yüksek çözünürlüklü görseller kullanın (minimum 2000x2000px)</li>
                    <li>Şeffaf arka planlı PNG dosyaları en iyi sonucu verir</li>
                    <li>Tasarımınızın kare veya dikdörtgen formatında olması önerilir</li>
                    <li>Baskı alanına uygun boyutlandırma yapılacaktır</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>

            {/* Aksiyonlar */}
            <div className="d-flex gap-2 mb-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerateMockup}
                disabled={loading || !selectedProduct || !selectedColor || !uploadedDesign}
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
                    Mockup Oluşturuluyor...
                  </>
                ) : (
                  '✨ Mockup Oluştur'
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={handleReset}
                disabled={loading}
              >
                🔄 Sıfırla
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            {/* Önizleme */}
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h5 className="mb-3">🖼️ Mockup Önizleme</h5>
                
                {!mockupResult && !loading && (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem' }} className="mb-3">
                      {selectedProductData?.icon || '👕'}
                    </div>
                    {selectedProduct && (
                      <Badge bg="secondary" className="mb-2">
                        {selectedProductData?.desc}
                      </Badge>
                    )}
                    {selectedColor && (
                      <div>
                        <Badge 
                          style={{ 
                            backgroundColor: selectedColorData?.hex,
                            color: ['white', 'yellow'].includes(selectedColor) ? '#000' : '#fff'
                          }}
                        >
                          {selectedColorData?.label}
                        </Badge>
                      </div>
                    )}
                    <p className="text-muted mt-3">
                      {selectedProduct && selectedColor && uploadedDesign 
                        ? 'Mockup oluşturmaya hazır!' 
                        : 'Mockup\'unuz burada görünecek'}
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted">Mockup oluşturuluyor...</p>
                    <small className="text-muted">Bu işlem birkaç saniye sürebilir</small>
                  </div>
                )}

                {mockupResult && (
                  <>
                    <div className="mb-3 p-3" style={{ 
                      backgroundColor: selectedColorData?.hex || '#fff',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}>
                      <img
                        src={mockupResult.imageUrl}
                        alt="Mockup Result"
                        className="img-fluid rounded"
                        style={{ 
                          width: '100%',
                          maxHeight: '400px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Ürün:</small>
                      <Badge bg="secondary">{selectedProductData?.desc}</Badge>
                      
                      <small className="text-muted d-block mt-2 mb-1">Renk:</small>
                      <Badge style={{ 
                        backgroundColor: selectedColorData?.hex,
                        color: ['white', 'yellow'].includes(selectedColor) ? '#000' : '#fff'
                      }}>
                        {selectedColorData?.label}
                      </Badge>
                    </div>

                    <Button
                      variant="success"
                      className="w-100 mb-2"
                      onClick={handleDownload}
                    >
                      ⬇️ Mockup İndir
                    </Button>
                    
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={handleGenerateMockup}
                      disabled={loading}
                    >
                      🔄 Yeniden Oluştur
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Özellikler */}
            <Card className="mt-4">
              <Card.Body>
                <h6 className="mb-3">✨ Özellikler</h6>
                <ul className="small mb-0">
                  <li className="mb-2">8 farklı ürün tipi</li>
                  <li className="mb-2">12 renk seçeneği</li>
                  <li className="mb-2">Yüksek kalite mockup</li>
                  <li className="mb-2">Gerçekçi ürün görüntüleme</li>
                  <li className="mb-2">Anında önizleme</li>
                  <li className="mb-0">İndirilebilir sonuçlar</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MockupGeneratorPage;


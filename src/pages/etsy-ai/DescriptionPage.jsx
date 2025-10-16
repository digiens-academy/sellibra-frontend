import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { aiApi } from '../../api/aiApi';
import { toast } from 'react-toastify';
import TokenDisplay from '../../components/common/TokenDisplay';
import useAuthStore from '../../store/authStore';

const DescriptionPage = () => {
  const { setTokensFromResponse } = useAuthStore();
  const [formData, setFormData] = useState({
    productName: '',
    productType: 'tişört',
    keywords: '',
    targetAudience: '',
    style: '',
    material: '',
    features: '',
    tone: 'professional'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productName.trim()) {
      toast.error('Lütfen ürün adını girin');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Keywords ve features'ı array'e çevir
      const requestData = {
        ...formData,
        keywords: formData.keywords 
          ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
          : [],
        features: formData.features
          ? formData.features.split(',').map(f => f.trim()).filter(f => f)
          : []
      };

      const response = await aiApi.generateEtsyDescription(requestData);
      
      if (response.success) {
        setResult(response.data);
        setTokensFromResponse(response.data.remainingTokens);
        toast.success(response.message || 'Açıklama başarıyla oluşturuldu!');
      }
    } catch (error) {
      console.error('Açıklama oluşturma hatası:', error);
      toast.error(error.response?.data?.message || 'Açıklama oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.description) {
      navigator.clipboard.writeText(result.description);
      toast.success('Açıklama panoya kopyalandı!');
    }
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      productType: 'tişört',
      keywords: '',
      targetAudience: '',
      style: '',
      material: '',
      features: '',
      tone: 'professional'
    });
    setResult(null);
  };

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header-wrapper">
          <div className="page-header">
            <h2>📝 Etsy Ürün Açıklaması Oluştur</h2>
            <p>SEO-optimized ürün açıklamaları ile satışlarınızı artırın</p>
          </div>
          <TokenDisplay />
        </div>

        <Row>
          <Col lg={6}>
            <Card className="mb-4">
              <Card.Body className="etsy-ai-container">
                <h5 className="mb-4">🎯 Ürün Bilgileri</h5>
                
                <Alert variant="info" className="mb-4">
                  <small>
                    <strong>💡 İpucu:</strong> Detaylı bilgi girdikçe daha iyi ve SEO-uyumlu açıklamalar elde edersiniz.
                  </small>
                </Alert>

                <Form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label htmlFor="productName">
                      Ürün Adı <Badge bg="danger">Zorunlu</Badge>
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="Örn: Vintage Çiçek Desenli Tişört"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="productType">Ürün Tipi</label>
                    <select
                      id="productType"
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                    >
                      <option value="tişört">Tişört</option>
                      <option value="sweatshirt">Sweatshirt</option>
                      <option value="hoodie">Hoodie</option>
                      <option value="tank top">Tank Top</option>
                      <option value="crop top">Crop Top</option>
                      <option value="polo tişört">Polo Tişört</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="keywords">
                      Anahtar Kelimeler <Badge bg="success">SEO</Badge>
                    </label>
                    <input
                      type="text"
                      id="keywords"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      placeholder="Virgülle ayırın: vintage, çiçek, kadın tişört, pamuk"
                    />
                    <small className="text-muted">
                      Etsy'de aranmasını istediğiniz kelimeler
                    </small>
                  </div>

                  <div className="input-group">
                    <label htmlFor="targetAudience">Hedef Kitle</label>
                    <input
                      type="text"
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      placeholder="Örn: 25-35 yaş arası kadınlar, yoga severler"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="style">Stil</label>
                    <input
                      type="text"
                      id="style"
                      name="style"
                      value={formData.style}
                      onChange={handleInputChange}
                      placeholder="Örn: Vintage, Modern, Minimal, Boho"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="material">Malzeme</label>
                    <input
                      type="text"
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="Örn: %100 Pamuk, Organik Pamuk"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="features">Özellikler</label>
                    <textarea
                      id="features"
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      placeholder="Virgülle ayırın: Yumuşak doku, Solmayan baskı, Unisex kesim"
                      rows={3}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="tone">Açıklama Tonu</label>
                    <select
                      id="tone"
                      name="tone"
                      value={formData.tone}
                      onChange={handleInputChange}
                    >
                      <option value="professional">Profesyonel</option>
                      <option value="casual">Samimi ve Arkadaşça</option>
                      <option value="enthusiastic">Coşkulu ve Heyecanlı</option>
                    </select>
                  </div>

                  <div className="d-flex gap-2">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="flex-grow-1"
                      disabled={loading}
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
                          Oluşturuluyor...
                        </>
                      ) : (
                        <>✨ Açıklama Oluştur</>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline-secondary"
                      onClick={handleReset}
                    >
                      🔄
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="mb-4">
              <Card.Body className="etsy-ai-container">
                <h5 className="mb-4">📄 Oluşturulan Açıklama</h5>

                {loading && (
                  <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" />
                    <p>AI ile SEO-uyumlu açıklama oluşturuluyor...</p>
                  </div>
                )}

                {!loading && !result && (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', opacity: 0.3 }}>📝</div>
                    <p className="text-muted mt-3">
                      Ürün bilgilerini doldurun ve<br />
                      açıklama oluştur butonuna tıklayın
                    </p>
                  </div>
                )}

                {result && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <Badge bg="primary" className="me-2">
                          {result.wordCount} kelime
                        </Badge>
                        <Badge bg="info">
                          {result.characterCount} karakter
                        </Badge>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        📋 Kopyala
                      </Button>
                    </div>

                    <div className="result-box">
                      <div className="result-content">
                        {result.description}
                      </div>
                    </div>

                    <Alert variant="success" className="mt-3">
                      <small>
                        <strong>✅ Başarılı!</strong> Açıklamanız SEO açısından optimize edildi.
                        Doğrudan Etsy'de kullanabilirsiniz.
                      </small>
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h6 className="mb-3">📌 SEO İpuçları</h6>
                <ul className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                  <li>İlk 160 karakter çok önemlidir (önizleme metni)</li>
                  <li>Anahtar kelimeleri doğal bir şekilde kullanın</li>
                  <li>Ürünün faydalarını özelliklerinden önce vurgulayın</li>
                  <li>Hedef kitlenize uygun dil kullanın</li>
                  <li>Call-to-action (harekete geçirici) ifadeler ekleyin</li>
                  <li>Paragrafları kısa ve okunabilir tutun</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DescriptionPage;


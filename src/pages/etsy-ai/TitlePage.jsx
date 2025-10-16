import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner, ButtonGroup } from 'react-bootstrap';
import { aiApi } from '../../api/aiApi';
import { toast } from 'react-toastify';
import TokenDisplay from '../../components/common/TokenDisplay';
import useAuthStore from '../../store/authStore';

const TitlePage = () => {
  const { setTokensFromResponse } = useAuthStore();
  const [activeTab, setActiveTab] = useState('title'); // 'title' veya 'tags'
  
  const [formData, setFormData] = useState({
    productName: '',
    productType: 'tişört',
    keywords: '',
    targetAudience: '',
    style: '',
    color: '',
    size: '',
    occasion: '',
    material: '',
    theme: ''
  });

  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

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
    
    if (activeTab === 'title') {
      setTitles([]);
      setSelectedTitle(null);
    } else {
      setTags([]);
      setSelectedTags([]);
    }

    try {
      // Keywords'ü array'e çevir
      const requestData = {
        ...formData,
        keywords: formData.keywords 
          ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
          : []
      };

      if (activeTab === 'title') {
        const response = await aiApi.generateEtsyTitle(requestData);
        
        if (response.success) {
          setTitles(response.data.titles || []);
          setTokensFromResponse(response.data.remainingTokens);
          toast.success(response.message || 'Başlıklar başarıyla oluşturuldu!');
        }
      } else {
        const response = await aiApi.generateEtsyTags(requestData);
        
        if (response.success) {
          setTags(response.data.tags || []);
          setTokensFromResponse(response.data.remainingTokens);
          toast.success(response.message || 'Taglar başarıyla oluşturuldu!');
        }
      }
    } catch (error) {
      console.error('Oluşturma hatası:', error);
      toast.error(error.response?.data?.message || 'Oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (title) => {
    if (title) {
      navigator.clipboard.writeText(title);
      toast.success('Başlık panoya kopyalandı!');
      setSelectedTitle(title);
    }
  };

  const toggleTagSelection = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const copySelectedTags = () => {
    if (selectedTags.length > 0) {
      const tagsText = selectedTags.join(', ');
      navigator.clipboard.writeText(tagsText);
      toast.success(`${selectedTags.length} tag panoya kopyalandı!`);
    } else {
      toast.warning('Lütfen kopyalamak için tag seçin');
    }
  };

  const copyAllTags = () => {
    if (tags.length > 0) {
      const tagsText = tags.join(', ');
      navigator.clipboard.writeText(tagsText);
      toast.success('Tüm taglar panoya kopyalandı!');
    }
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      productType: 'tişört',
      keywords: '',
      targetAudience: '',
      style: '',
      color: '',
      size: '',
      occasion: '',
      material: '',
      theme: ''
    });
    setTitles([]);
    setSelectedTitle(null);
    setTags([]);
    setSelectedTags([]);
  };

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header-wrapper">
          <div className="page-header">
            <h2>🏷️ Etsy Başlık & Tag Oluşturucu</h2>
            <p>SEO-optimized başlıklar ve taglar ile görünürlüğünüzü artırın</p>
          </div>
          <TokenDisplay />
        </div>

        {/* Tab Switcher */}
        <div className="mb-4 d-flex justify-content-center">
          <ButtonGroup size="lg">
            <Button 
              variant={activeTab === 'title' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('title')}
              style={{ minWidth: '200px' }}
            >
              🏷️ Başlık Oluştur
            </Button>
            <Button 
              variant={activeTab === 'tags' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('tags')}
              style={{ minWidth: '200px' }}
            >
              🏷 Tag Oluştur
            </Button>
          </ButtonGroup>
        </div>

        <Row>
          <Col lg={5}>
            <Card className="mb-4">
              <Card.Body className="etsy-ai-container">
                <h5 className="mb-4">🎯 Ürün Bilgileri</h5>
                
                <Alert variant="info" className="mb-4">
                  <small>
                    <strong>💡 İpucu:</strong> {activeTab === 'title' 
                      ? 'Etsy başlık limiti 140 karakterdir. En önemli kelimeleri başa yazın!' 
                      : 'Etsy\'de maksimum 13 tag kullanabilirsiniz. Her tag maksimum 20 karakter olmalı!'}
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
                      placeholder="Örn: Vintage Çiçek Desenli Kadın Tişört"
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
                      placeholder="Virgülle ayırın: vintage, çiçek, pamuk, unisex"
                    />
                    <small className="text-muted">
                      En önemli 3-5 anahtar kelime
                    </small>
                  </div>

                  <div className="input-group">
                    <label htmlFor="targetAudience">Hedef Kitle</label>
                    <select
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                    >
                      <option value="">Seçiniz</option>
                      <option value="kadın">Kadın</option>
                      <option value="erkek">Erkek</option>
                      <option value="unisex">Unisex</option>
                      <option value="çocuk">Çocuk</option>
                      <option value="bebek">Bebek</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="style">Stil</label>
                    <input
                      type="text"
                      id="style"
                      name="style"
                      value={formData.style}
                      onChange={handleInputChange}
                      placeholder="Örn: Vintage, Modern, Minimal"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="color">Renk</label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="Örn: Siyah, Beyaz, Mavi"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="size">Beden Bilgisi</label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="Örn: XS-XXL, Oversize, Regular"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="occasion">Kullanım Alanı</label>
                    <input
                      type="text"
                      id="occasion"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      placeholder="Örn: Günlük, Spor, Parti"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="material">
                      Malzeme {activeTab === 'tags' && <Badge bg="info">Tag için önemli</Badge>}
                    </label>
                    <input
                      type="text"
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="Örn: %100 Pamuk, Polyester"
                    />
                  </div>

                  {activeTab === 'tags' && (
                    <div className="input-group">
                      <label htmlFor="theme">
                        Tema <Badge bg="info">Tag için önemli</Badge>
                      </label>
                      <input
                        type="text"
                        id="theme"
                        name="theme"
                        value={formData.theme}
                        onChange={handleInputChange}
                        placeholder="Örn: Minimalist, Retro, Doğa, Müzik"
                      />
                    </div>
                  )}

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
                        <>✨ {activeTab === 'title' ? 'Başlıklar' : 'Taglar'} Oluştur</>
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

          <Col lg={7}>
            <Card className="mb-4">
              <Card.Body className="etsy-ai-container">
                <h5 className="mb-4">
                  {activeTab === 'title' ? '📝 Oluşturulan Başlıklar' : '🏷 Oluşturulan Taglar'}
                </h5>

                {loading && (
                  <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" />
                    <p>AI ile SEO-uyumlu {activeTab === 'title' ? 'başlıklar' : 'taglar'} oluşturuluyor...</p>
                  </div>
                )}

                {!loading && activeTab === 'title' && titles.length === 0 && (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', opacity: 0.3 }}>🏷️</div>
                    <p className="text-muted mt-3">
                      Ürün bilgilerini doldurun ve<br />
                      başlıklar oluştur butonuna tıklayın
                    </p>
                  </div>
                )}

                {!loading && activeTab === 'tags' && tags.length === 0 && (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', opacity: 0.3 }}>🏷</div>
                    <p className="text-muted mt-3">
                      Ürün bilgilerini doldurun ve<br />
                      taglar oluştur butonuna tıklayın
                    </p>
                  </div>
                )}

                {activeTab === 'title' && titles.length > 0 && (
                  <div>
                    <Alert variant="success" className="mb-3">
                      <small>
                        <strong>✅ {titles.length} adet başlık oluşturuldu!</strong> 
                        {' '}Beğendiğinizi seçip kopyalayabilirsiniz.
                      </small>
                    </Alert>

                    <div className="d-flex flex-column gap-3">
                      {titles.map((title, index) => (
                        <Card 
                          key={index} 
                          className={`title-option ${selectedTitle === title ? 'border-primary' : ''}`}
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-2">
                                  <Badge bg="primary" className="me-2">
                                    Seçenek {index + 1}
                                  </Badge>
                                  <Badge bg={title.length <= 140 ? 'success' : 'danger'}>
                                    {title.length}/140 karakter
                                  </Badge>
                                </div>
                                <p className="mb-0" style={{ lineHeight: '1.6' }}>
                                  {title}
                                </p>
                              </div>
                              <Button 
                                variant={selectedTitle === title ? 'primary' : 'outline-primary'}
                                size="sm"
                                className="ms-3"
                                onClick={() => copyToClipboard(title)}
                              >
                                {selectedTitle === title ? '✓ Kopyalandı' : '📋 Kopyala'}
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'tags' && tags.length > 0 && (
                  <div>
                    <Alert variant="success" className="mb-3">
                      <small>
                        <strong>✅ {tags.length} adet tag oluşturuldu!</strong> 
                        {' '}Tagları seçin ve kopyalayın.
                      </small>
                    </Alert>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <Badge bg="info" className="me-2">
                            Seçilen: {selectedTags.length}/13
                          </Badge>
                          <Badge bg="secondary">
                            Toplam: {tags.length} tag
                          </Badge>
                        </div>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={copySelectedTags}
                            disabled={selectedTags.length === 0}
                          >
                            📋 Seçilenleri Kopyala
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={copyAllTags}
                          >
                            📋 Tümünü Kopyala
                          </Button>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            bg={selectedTags.includes(tag) ? 'primary' : 'secondary'}
                            style={{ 
                              fontSize: '0.9rem',
                              padding: '0.5rem 0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              userSelect: 'none'
                            }}
                            onClick={() => toggleTagSelection(tag)}
                          >
                            {selectedTags.includes(tag) && '✓ '}
                            {tag}
                            <small className="ms-2" style={{ opacity: 0.7 }}>
                              ({tag.length})
                            </small>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Alert variant="info" className="mt-3">
                      <small>
                        <strong>💡 Kullanım:</strong> Taglara tıklayarak seçin/seçimi kaldırın. 
                        Seçtiğiniz taglar Etsy'de kullanım için hazır!
                      </small>
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h6 className="mb-3">
                  📌 {activeTab === 'title' ? 'Etsy Başlık SEO İpuçları' : 'Etsy Tag SEO İpuçları'}
                </h6>
                {activeTab === 'title' ? (
                  <ul className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>140 karakter limiti:</strong> Her karakteri akıllıca kullanın</li>
                    <li><strong>Anahtar kelimeler:</strong> En önemlileri başa yazın</li>
                    <li><strong>Açıklayıcı olun:</strong> Ne sattığınızı net belirtin</li>
                    <li><strong>Özellikler ekleyin:</strong> Renk, beden, malzeme</li>
                    <li><strong>Hedef kitle:</strong> Kim için olduğunu belirtin</li>
                    <li><strong>Tekrar yapmayın:</strong> Aynı kelimeyi gereksiz tekrarlamayın</li>
                    <li><strong>Doğal okuyun:</strong> Robot gibi değil, insana hitap edin</li>
                  </ul>
                ) : (
                  <ul className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>13 tag limiti:</strong> En etkili 13 tagı seçin</li>
                    <li><strong>20 karakter:</strong> Her tag maksimum 20 karakter</li>
                    <li><strong>Çok kelimeli taglar:</strong> "kadın tişört" gibi kompozit kullanın</li>
                    <li><strong>Geniş ve dar kelimeler:</strong> Hem genel hem spesifik taglar ekleyin</li>
                    <li><strong>Tekil ve çoğul:</strong> İkisini de ayrı ayrı ekleyin</li>
                    <li><strong>Uzun kuyruklu:</strong> Nişe özel detaylı taglar kullanın</li>
                    <li><strong>Rakip analizi:</strong> Başarılı satıcıların taglarına bakın</li>
                  </ul>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TitlePage;


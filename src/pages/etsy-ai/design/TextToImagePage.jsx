import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { aiApi } from '../../../api/aiApi';
import TokenDisplay from '../../../components/common/TokenDisplay';
import useAuthStore from '../../../store/authStore';

const TextToImagePage = () => {
  const { setTokensFromResponse } = useAuthStore();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Tişört tasarım stilleri
  const designStyles = [
    { value: 'minimalist', label: 'Minimalist', desc: 'Sade ve temiz tasarım' },
    { value: 'vintage', label: 'Vintage', desc: 'Retro ve nostaljik' },
    { value: 'modern', label: 'Modern', desc: 'Çağdaş ve şık' },
    { value: 'grunge', label: 'Grunge', desc: 'Yıpranmış ve raw' },
    { value: 'cartoon', label: 'Karikatür', desc: 'Eğlenceli ve canlı' },
    { value: 'geometric', label: 'Geometrik', desc: 'Şekiller ve desenler' }
  ];

  // Tema seçenekleri
  const themes = [
    { value: 'nature', label: '🌿 Doğa', desc: 'Bitkiler, hayvanlar, manzara' },
    { value: 'music', label: '🎵 Müzik', desc: 'Enstrümanlar, notalar, konsep' },
    { value: 'sports', label: '⚽ Spor', desc: 'Atletik ve dinamik' },
    { value: 'food', label: '🍕 Yemek', desc: 'Lezzetli ve renkli' },
    { value: 'travel', label: '✈️ Seyahat', desc: 'Yerler ve macera' },
    { value: 'typography', label: '✍️ Tipografi', desc: 'Yazı ve slogan' },
    { value: 'abstract', label: '🎨 Soyut', desc: 'Sanatsal ve özgür' },
    { value: 'funny', label: '😄 Komik', desc: 'Mizahi ve eğlenceli' }
  ];

  // Renk paletleri
  const colorPalettes = [
    { value: 'monochrome', label: 'Monokrom', colors: ['#000000', '#FFFFFF'] },
    { value: 'vibrant', label: 'Canlı Renkler', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'] },
    { value: 'pastel', label: 'Pastel', colors: ['#FFB6C1', '#B4E7CE', '#C9C0F6'] },
    { value: 'earth', label: 'Toprak Tonları', colors: ['#8B4513', '#D2691E', '#CD853F'] },
    { value: 'neon', label: 'Neon', colors: ['#FF006E', '#00F5FF', '#39FF14'] },
    { value: 'ocean', label: 'Okyanus', colors: ['#006994', '#00B4D8', '#90E0EF'] }
  ];

  // Örnek promptlar
  const examplePrompts = [
    'Güneş gözlüğü takan sevimli bir kedi',
    'Bir roket üzerinde sörf yapan astronot',
    'Dağların üzerinde gün batımı',
    'Ayakkabı giyen sevimli bir köpek',
    'Kask takan sevimli sincap',
    'Typography design, "COFFEE, SLEEP, REPEAT"'
  ];

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  const buildFullPrompt = () => {
    let fullPrompt = prompt;
    
    if (selectedStyle) {
      fullPrompt += `, ${selectedStyle} style`;
    }
    
    if (selectedTheme) {
      const theme = themes.find(t => t.value === selectedTheme);
      fullPrompt += `, ${theme?.label} themed`;
    }
    
    if (selectedColors.length > 0) {
      const colorPalette = colorPalettes.find(cp => cp.value === selectedColors[0]);
      fullPrompt += `, using ${colorPalette?.label} color palette`;
    }
    
    fullPrompt += ',  isolated on a plain white background, high quality';
    
    return fullPrompt;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Lütfen tasarım açıklaması girin');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setGeneratedImage(null);

    try {
      const fullPrompt = buildFullPrompt();
      const response = await aiApi.textToImage(fullPrompt, {
        size: '1024x1024',
        quality: 'hd'
      });

      setGeneratedImage(response.data.url);
      setTokensFromResponse(response.data.remainingTokens);
      setSuccess(true);
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err.response?.data?.message || 'Görsel oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (generatedImage) {
      try {
        // Backend proxy üzerinden indir (CORS sorunu çözümü)
        await aiApi.downloadImage(generatedImage, `tshirt-design-${Date.now()}.png`);
      } catch (error) {
        console.error('Download error:', error);
        setError(error.response?.data?.message || 'Görsel indirilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const handleReset = () => {
    setPrompt('');
    setSelectedStyle('');
    setSelectedTheme('');
    setSelectedColors([]);
    setGeneratedImage(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="dashboard-container etsy-ai-container">
      <Container fluid className="main-content">
        <div className="page-header-wrapper">
          <div className="page-header">
            <h2>✨ Text-to-Image - Tişört Tasarımı</h2>
            <p>AI ile hayal ettiğiniz tişört tasarımını oluşturun</p>
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
            Tasarım başarıyla oluşturuldu! 🎉
          </Alert>
        )}

        <Row>
          <Col lg={8}>
            {/* Ana Form */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">📝 Tasarım Açıklaması</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Tasarımınızı detaylı olarak açıklayın</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Örn: Minimalist bir dağ manzarası, gün batımı renkleriyle, basit çizgilerle..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Ne kadar detaylı açıklarsanız, sonuç o kadar iyi olur.
                  </Form.Text>
                </Form.Group>

                {/* Örnek Promptlar */}
                <div className="mb-4">
                  <h6 className="mb-2">💡 Örnek Tasarım Fikirleri</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {examplePrompts.map((example, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        text="dark"
                        className="p-2"
                        style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                        onClick={() => handleExampleClick(example)}
                      >
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stil Seçimi */}
                <div className="mb-4">
                  <h6 className="mb-3">🎨 Tasarım Stili</h6>
                  <Row>
                    {designStyles.map((style) => (
                      <Col md={4} key={style.value} className="mb-3">
                        <Card
                          className={`text-center ${selectedStyle === style.value ? 'border-primary' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleStyleSelect(style.value)}
                        >
                          <Card.Body className="p-3">
                            <div className="fw-bold mb-1">{style.label}</div>
                            <small className="text-muted">{style.desc}</small>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Tema Seçimi */}
                <div className="mb-4">
                  <h6 className="mb-3">🎯 Tema</h6>
                  <Row>
                    {themes.map((theme) => (
                      <Col md={3} key={theme.value} className="mb-3">
                        <Card
                          className={`text-center ${selectedTheme === theme.value ? 'border-primary' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleThemeSelect(theme.value)}
                        >
                          <Card.Body className="p-2">
                            <div className="mb-1">{theme.label}</div>
                            <small className="text-muted">{theme.desc}</small>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Renk Paleti */}
                <div className="mb-4">
                  <h6 className="mb-3">🌈 Renk Paleti</h6>
                  <Row>
                    {colorPalettes.map((palette) => (
                      <Col md={4} key={palette.value} className="mb-3">
                        <Card
                          className={`${selectedColors.includes(palette.value) ? 'border-primary' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleColorToggle(palette.value)}
                        >
                          <Card.Body className="p-3">
                            <div className="fw-bold mb-2">{palette.label}</div>
                            <div className="d-flex gap-1">
                              {palette.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: color,
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                  }}
                                />
                              ))}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Aksiyonlar */}
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
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
                        Oluşturuluyor...
                      </>
                    ) : (
                      '✨ Tasarımı Oluştur'
                    )}
                  </Button>
                  <Button variant="outline-secondary" onClick={handleReset}>
                    🔄 Sıfırla
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Önizleme ve Sonuç */}
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h5 className="mb-3">🖼️ Önizleme</h5>
                
                {!generatedImage && !loading && (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem' }} className="mb-3">
                      👕
                    </div>
                    <p className="text-muted">
                      Tasarımınız burada görünecek
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted">AI tasarımınızı oluşturuyor...</p>
                  </div>
                )}

                {generatedImage && (
                  <>
                    <div className="mb-3">
                      <img
                        src={generatedImage}
                        alt="Generated Design"
                        className="img-fluid rounded"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <Button
                      variant="success"
                      className="w-100"
                      onClick={handleDownload}
                    >
                      ⬇️ Tasarımı İndir
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
                  <li className="mb-2">Tasarımınızı detaylı açıklayın</li>
                  <li className="mb-2">Renkleri, stilleri ve temaları belirtin</li>
                  <li className="mb-2">Basit ve anlaşılır olmasına dikkat edin</li>
                  <li className="mb-2">Farklı seçenekleri deneyerek en iyi sonucu bulun</li>
                  <li className="mb-0">Baskıya uygun yüksek kalite tasarımlar üretin</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TextToImagePage;


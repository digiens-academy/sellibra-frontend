import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert, InputGroup, ButtonGroup } from 'react-bootstrap';
import { FaCalculator, FaDollarSign, FaLiraSign, FaInfoCircle } from 'react-icons/fa';

const ProfitCalculatorPage = () => {
  // Para birimi
  const [currency, setCurrency] = useState('USD'); // USD veya TRY

  // Fiyatlar
  const [salePrice, setSalePrice] = useState('');
  const [productCost, setProductCost] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [otherCosts, setOtherCosts] = useState('');

  // Döviz kuru
  const [usdToTry, setUsdToTry] = useState(34.50); // Güncel kur

  // Hesaplanan değerler
  const [calculations, setCalculations] = useState(null);

  // Etsy ücret oranları
  const ETSY_FEES = {
    listingFee: 0.20, // USD - 4 aylık ilan ücreti
    transactionFeeRate: 0.065, // %6.5
    paymentProcessingRate: 0.03, // %3
    paymentProcessingFixed: 0.25, // $0.25
    currencyConversionRate: 0.025, // %2.5 (farklı para birimi kullanıldığında)
    offSiteAdsRate: 0.15, // %15 (opsiyonel - $10,000+ satış yapanlara zorunlu)
  };

  // Hesaplama fonksiyonu
  const calculateProfit = useCallback(() => {
    const sale = parseFloat(salePrice) || 0;
    const cost = parseFloat(productCost) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const other = parseFloat(otherCosts) || 0;

    if (sale === 0) {
      setCalculations(null);
      return;
    }

    let salePriceUSD = sale;
    let costUSD = cost;
    let shippingUSD = shipping;
    let otherUSD = other;

    // TRY ise USD'ye çevir
    if (currency === 'TRY') {
      salePriceUSD = sale / usdToTry;
      costUSD = cost / usdToTry;
      shippingUSD = shipping / usdToTry;
      otherUSD = other / usdToTry;
    }

    // Etsy ücretleri hesapla
    const listingFee = ETSY_FEES.listingFee;
    const transactionFee = salePriceUSD * ETSY_FEES.transactionFeeRate;
    const paymentProcessingFee = (salePriceUSD * ETSY_FEES.paymentProcessingRate) + ETSY_FEES.paymentProcessingFixed;
    
    // Döviz çevirimi ücreti (Türkiye'den satış yapıyorsak)
    const currencyConversionFee = currency === 'TRY' ? (salePriceUSD * ETSY_FEES.currencyConversionRate) : 0;

    // Toplam Etsy ücretleri
    const totalEtsyFees = listingFee + transactionFee + paymentProcessingFee + currencyConversionFee;

    // Toplam maliyetler
    const totalCosts = costUSD + shippingUSD + otherUSD + totalEtsyFees;

    // Net kar/zarar
    const netProfit = salePriceUSD - totalCosts;
    const profitMargin = (netProfit / salePriceUSD) * 100;

    // TRY'ye çevir (gerekirse)
    const results = {
      currency: currency,
      usdToTry: usdToTry,
      sale: {
        usd: salePriceUSD,
        try: salePriceUSD * usdToTry,
      },
      costs: {
        product: { usd: costUSD, try: costUSD * usdToTry },
        shipping: { usd: shippingUSD, try: shippingUSD * usdToTry },
        other: { usd: otherUSD, try: otherUSD * usdToTry },
      },
      etsyFees: {
        listing: { usd: listingFee, try: listingFee * usdToTry },
        transaction: { usd: transactionFee, try: transactionFee * usdToTry },
        paymentProcessing: { usd: paymentProcessingFee, try: paymentProcessingFee * usdToTry },
        currencyConversion: { usd: currencyConversionFee, try: currencyConversionFee * usdToTry },
        total: { usd: totalEtsyFees, try: totalEtsyFees * usdToTry },
      },
      totalCosts: {
        usd: totalCosts,
        try: totalCosts * usdToTry,
      },
      netProfit: {
        usd: netProfit,
        try: netProfit * usdToTry,
      },
      profitMargin: profitMargin,
    };

    setCalculations(results);
  }, [salePrice, productCost, shippingCost, otherCosts, currency, usdToTry]);

  // Form değiştiğinde otomatik hesapla
  useEffect(() => {
    calculateProfit();
  }, [calculateProfit]);

  const formatMoney = (amount, curr = 'USD') => {
    if (isNaN(amount)) return '0.00';
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleReset = () => {
    setSalePrice('');
    setProductCost('');
    setShippingCost('');
    setOtherCosts('');
    setCalculations(null);
  };

  const isProfit = calculations && calculations.netProfit.usd > 0;

  return (
    <div className="dashboard-container etsy-ai-container">
      <Container fluid className="main-content">
        <div className="page-header">
          <h2 className="d-flex align-items-center gap-2">
            <FaCalculator style={{ color: '#00D4A0' }} /> Etsy Kar Hesaplayıcı
          </h2>
          <p>Tişört satışlarınızdan kazancınızı hesaplayın</p>
        </div>

        {/* Uyarı Mesajı */}
        <Alert variant="info" className="mb-4">
          <FaInfoCircle className="me-2" />
          <strong>Not:</strong> Bu hesaplayıcı Etsy'nin güncel ücret politikalarını kullanır. 
          Döviz kurları değişkenlik gösterebilir ve sonuçlar yaklaşık değerlerdir.
        </Alert>

        <Row>
          <Col lg={7}>
            {/* Giriş Formu */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">💰 Fiyat Bilgileri</h5>

                {/* Para Birimi Seçimi */}
                <Form.Group className="mb-4">
                  <Form.Label>Para Birimi</Form.Label>
                  <ButtonGroup className="w-100">
                    <Button
                      variant={currency === 'USD' ? 'primary' : 'outline-primary'}
                      onClick={() => setCurrency('USD')}
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaDollarSign /> USD (Dolar)
                    </Button>
                    <Button
                      variant={currency === 'TRY' ? 'primary' : 'outline-primary'}
                      onClick={() => setCurrency('TRY')}
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaLiraSign /> TRY (Türk Lirası)
                    </Button>
                  </ButtonGroup>
                </Form.Group>

                {/* Döviz Kuru */}
                {currency === 'TRY' && (
                  <Form.Group className="mb-3">
                    <Form.Label>USD/TRY Kuru</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$1 =</InputGroup.Text>
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={usdToTry}
                        onChange={(e) => setUsdToTry(parseFloat(e.target.value) || 0)}
                      />
                      <InputGroup.Text>₺</InputGroup.Text>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Güncel döviz kurunu girin
                    </Form.Text>
                  </Form.Group>
                )}

                {/* Satış Fiyatı */}
                <Form.Group className="mb-3">
                  <Form.Label>Satış Fiyatı *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>{currency === 'USD' ? '$' : '₺'}</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Örn: 25.00"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Ürünü Etsy'de ne fiyata satacaksınız?
                  </Form.Text>
                </Form.Group>

                <hr />

                <h6 className="mb-3">📦 Maliyet Bilgileri</h6>

                {/* Ürün Maliyeti */}
                <Form.Group className="mb-3">
                  <Form.Label>Ürün Maliyeti *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>{currency === 'USD' ? '$' : '₺'}</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Örn: 10.00"
                      value={productCost}
                      onChange={(e) => setProductCost(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Tişört + baskı maliyeti
                  </Form.Text>
                </Form.Group>

                {/* Kargo Maliyeti */}
                <Form.Group className="mb-3">
                  <Form.Label>Kargo Maliyeti</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>{currency === 'USD' ? '$' : '₺'}</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Örn: 5.00"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Müşteriye gönderim ücreti
                  </Form.Text>
                </Form.Group>

                {/* Diğer Maliyetler */}
                <Form.Group className="mb-3">
                  <Form.Label>Diğer Maliyetler</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>{currency === 'USD' ? '$' : '₺'}</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Örn: 2.00"
                      value={otherCosts}
                      onChange={(e) => setOtherCosts(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Paketleme, etiket, vs.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2 mt-4">
                  <Button variant="primary" onClick={calculateProfit} className="flex-grow-1">
                    <FaCalculator className="me-2" />
                    Hesapla
                  </Button>
                  <Button variant="outline-secondary" onClick={handleReset}>
                    Sıfırla
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Etsy Ücretleri Açıklaması */}
            <Card className="mb-4 bg-light">
              <Card.Body>
                <h6 className="mb-3">ℹ️ Etsy Ücret Yapısı</h6>
                <Table size="sm" className="mb-0">
                  <tbody>
                    <tr>
                      <td><strong>İlan Ücreti:</strong></td>
                      <td>$0.20 (4 ay için)</td>
                    </tr>
                    <tr>
                      <td><strong>İşlem Ücreti:</strong></td>
                      <td>%6.5 (satış fiyatından)</td>
                    </tr>
                    <tr>
                      <td><strong>Ödeme İşleme Ücreti:</strong></td>
                      <td>%3 + $0.25</td>
                    </tr>
                    <tr>
                      <td><strong>Döviz Çevirimi:</strong></td>
                      <td>%2.5 (farklı para birimi kullanıldığında)</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            {/* Sonuçlar */}
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h5 className="mb-3">📊 Hesaplama Sonuçları</h5>

                {!calculations ? (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem' }} className="mb-3">
                      <FaCalculator />
                    </div>
                    <p className="text-muted">
                      Fiyat bilgilerini girin
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Özet */}
                    <div className={`p-3 rounded mb-3 ${isProfit ? 'bg-success' : 'bg-danger'} text-white`}>
                      <div className="text-center">
                        <h6 className="mb-2">{isProfit ? '✅ Net Kar' : '❌ Net Zarar'}</h6>
                        <h3 className="mb-1">
                          {currency === 'USD' ? '$' : '₺'}
                          {formatMoney(
                            currency === 'USD' ? calculations.netProfit.usd : calculations.netProfit.try
                          )}
                        </h3>
                        <small>
                          Kar Marjı: {formatMoney(calculations.profitMargin)}%
                        </small>
                      </div>
                    </div>

                    {/* Detaylı Tablo */}
                    <Table size="sm" bordered>
                      <tbody>
                        <tr className="table-primary">
                          <td colSpan="2" className="fw-bold">
                            💵 Gelir
                          </td>
                        </tr>
                        <tr>
                          <td>Satış Fiyatı</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.sale.usd : calculations.sale.try
                            )}
                          </td>
                        </tr>

                        <tr className="table-warning">
                          <td colSpan="2" className="fw-bold">
                            📦 Maliyetler
                          </td>
                        </tr>
                        <tr>
                          <td>Ürün Maliyeti</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.costs.product.usd : calculations.costs.product.try
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Kargo</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.costs.shipping.usd : calculations.costs.shipping.try
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Diğer</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.costs.other.usd : calculations.costs.other.try
                            )}
                          </td>
                        </tr>

                        <tr className="table-danger">
                          <td colSpan="2" className="fw-bold">
                            🏪 Etsy Ücretleri
                          </td>
                        </tr>
                        <tr>
                          <td>İlan Ücreti</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.etsyFees.listing.usd : calculations.etsyFees.listing.try
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>İşlem Ücreti (%6.5)</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.etsyFees.transaction.usd : calculations.etsyFees.transaction.try
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Ödeme İşleme</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.etsyFees.paymentProcessing.usd : calculations.etsyFees.paymentProcessing.try
                            )}
                          </td>
                        </tr>
                        {calculations.etsyFees.currencyConversion.usd > 0 && (
                          <tr>
                            <td>Döviz Çevirimi (%2.5)</td>
                            <td className="text-end">
                              {currency === 'USD' ? '$' : '₺'}
                              {formatMoney(
                                currency === 'USD' ? calculations.etsyFees.currencyConversion.usd : calculations.etsyFees.currencyConversion.try
                              )}
                            </td>
                          </tr>
                        )}
                        <tr className="fw-bold">
                          <td>Toplam Etsy Ücretleri</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.etsyFees.total.usd : calculations.etsyFees.total.try
                            )}
                          </td>
                        </tr>

                        <tr className="table-info">
                          <td colSpan="2" className="fw-bold">
                            📈 Toplam
                          </td>
                        </tr>
                        <tr className="fw-bold">
                          <td>Toplam Maliyetler</td>
                          <td className="text-end">
                            {currency === 'USD' ? '$' : '₺'}
                            {formatMoney(
                              currency === 'USD' ? calculations.totalCosts.usd : calculations.totalCosts.try
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </Table>

                    {/* Döviz Kuru Bilgisi */}
                    {currency === 'TRY' && (
                      <Alert variant="secondary" className="small mb-0">
                        <strong>USD Karşılığı:</strong> $
                        {formatMoney(calculations.netProfit.usd)} 
                        <br />
                        <small>Kur: $1 = ₺{formatMoney(usdToTry)}</small>
                      </Alert>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>

            {/* İpuçları */}
            {calculations && (
              <Card className="mt-4">
                <Card.Body>
                  <h6 className="mb-3">💡 İpuçları</h6>
                  <ul className="small mb-0">
                    <li className="mb-2">
                      Kar marjınız en az %30-40 olmalıdır
                    </li>
                    <li className="mb-2">
                      Döviz kurunu düzenli olarak güncelleyin
                    </li>
                    <li className="mb-2">
                      Etsy reklamları için bütçe ayırın (%5-10)
                    </li>
                    <li className="mb-2">
                      Kargo maliyetlerini müşteriye yansıtmayı düşünün
                    </li>
                    <li className="mb-0">
                      Toplu üretimle birim maliyeti düşürebilirsiniz
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfitCalculatorPage;


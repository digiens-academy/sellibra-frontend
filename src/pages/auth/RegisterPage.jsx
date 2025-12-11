import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Offcanvas } from "react-bootstrap";
import { FaInfoCircle, FaCrown, FaCheckCircle } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useAuthStore from "../../store/authStore";
import { ROUTES } from "../../utils/constants";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    etsyStoreUrl: "",
  });

  const [showOffcanvas, setShowOffcanvas] = useState(true); // Default olarak açık

  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phoneNumber: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await register(formData);
    if (success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <section className="register-section">
      {/* Info Butonu - Offcanvas'ı açmak için */}
      {!showOffcanvas && (
        <Button
          variant="primary"
          className="position-fixed d-flex align-items-center gap-2 shadow-lg"
          style={{
            top: "20px",
            right: "20px",
            zIndex: 1040,
            borderRadius: "50px",
            padding: "12px 24px",
            fontWeight: "600",
          }}
          onClick={() => setShowOffcanvas(true)}
        >
          <FaInfoCircle size={20} />
          Önemli Bilgi
        </Button>
      )}

      <Container fluid className="h-100">
        <Row className="h-100 g-0">
          {/* Sol Taraf - Görsel/Pattern */}
          <Col lg={5} className="d-none d-lg-block register-image-col">
            <div className="register-image-wrapper">
              <img
                src="/59271.jpg"
                alt="Register"
                className="register-background-image"
              />
              <div className="pattern-overlay"></div>
              <div className="register-image-content">
                <h2>Sellibra'ya Hoş Geldiniz</h2>
                <p>E-ticaret yolculuğunuza bugün başlayın</p>
                <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded border border-warning">
                  <p className="mb-0 small text-white">
                    <strong>⚠️ Önemli Duyuru:</strong> Etsy mağaza linklerini
                    girmeleri için kullanıcılardan gelen yoğun talep üzerine
                    süreyi uzatmaya karar verdik! Henüz mağaza URL'nizi
                    girmediyseniz endişelenmeyin; <strong style={{color: '#FD7979'}}>25 Aralık 2025</strong> tarihine kadar
                    vaktiniz var.
                  </p>
                </div>
              </div>
            </div>
          </Col>

          {/* Sağ Taraf - Form */}
          <Col
            lg={7}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="register-form-container">
              <div className="text-center mb-4">
                <img
                  src="/59271.jpg"
                  alt="Background"
                  className="register-logo-background-image"
                />
                <div className="register-logo-overlay"></div>
                <div className="register-logo-content">
                  <Link to={ROUTES.HOME} className="d-inline-block mb-3">
                    <img
                      src="/logo-with-sellibra.svg"
                      alt="Sellibra"
                      className="register-logo"
                    />
                  </Link>
                  <h2 className="register-title">Hemen Kayıt Olun</h2>
                  <p className="register-subtitle">
                    Formu doldurarak kayıt olabilirsiniz.
                  </p>
                </div>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Ad</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Adınız"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Soyad</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Soyadınız"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">
                    E-posta Adresi
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">
                    Telefon Numarası
                  </Form.Label>
                  <PhoneInput
                    country={"tr"}
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: "phoneNumber",
                      disabled: loading,
                    }}
                    containerClass="phone-input-container"
                    inputClass="form-control"
                    buttonClass="phone-input-button"
                    dropdownClass="phone-input-dropdown"
                    enableSearch={true}
                    searchPlaceholder="Ülke ara..."
                    placeholder="5XX XXX XX XX"
                  />
                  <Form.Text className="text-muted">
                    Ülke kodunu seçin ve telefon numaranızı girin
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">
                    Etsy Mağaza URL{" "}
                    <span className="text-muted small">(Opsiyonel)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="etsyStoreUrl"
                    placeholder="Etsy URL veya mağaza adı"
                    value={formData.etsyStoreUrl}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                  <Form.Text className="text-muted">
                    Etsy mağaza URL'nizi veya sadece mağaza adınızı giriniz. 30
                    Kasım 2025'e kadar girebilirsiniz.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-modern">Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                  <Form.Text className="text-muted">
                    En az 6 karakter olmalıdır
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="btn-register-modern w-100"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                </Button>

                <p className="text-center text-muted mt-4 mb-0">
                  Zaten hesabınız var mı?{" "}
                  <Link to={ROUTES.LOGIN} className="register-link">
                    Giriş Yap
                  </Link>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Premium Bilgilendirme Offcanvas */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
        backdrop={false}
        scroll={true}
        style={{
          width: "400px",
          backgroundColor: "rgba(33, 82, 95, 0.15)",
          zIndex: 1030,
        }}
      >
        <Offcanvas.Header
          closeButton
          closeVariant="white"
          className="border-bottom"
          style={{
            backgroundColor: "rgba(33, 82, 95, 0.15)",
            padding: "20px 24px",
            borderBottomColor: "rgba(255, 255, 255, 0.2) !important",
          }}
        >
          <Offcanvas.Title
            className="d-flex align-items-center gap-2 fw-bold"
            style={{ color: "#fff" }}
          >
            <FaCrown style={{ color: "#ffc107" }} size={24} />
            Premium Bilgilendirme
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{ padding: "24px", backgroundColor: "rgba(33, 82, 95, 0.15)" }}
        >
          {/* İlk Bilgilendirme */}
          <div
            className="mb-4 p-4 rounded-3 border-start border-4"
            style={{
              backgroundColor: "#e7f3ff",
              borderColor: "#0d6efd !important",
            }}
          >
            <div className="d-flex align-items-start gap-3 mb-3">
              <FaCheckCircle
                style={{
                  color: "#0d6efd",
                  fontSize: "1.5rem",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              />
              <h6 className="mb-0 fw-bold" style={{ color: "#0d6efd" }}>
                Etsy Yapay Zeka Tool Erişimi
              </h6>
            </div>
            <p
              className="mb-0"
              style={{
                fontSize: "0.95rem",
                lineHeight: "1.6",
                color: "#495057",
              }}
            >
              Premium aboneleri{" "}
              <strong>
                eğitime kayıt oldukları mail ile Sellibra'ya üye olduklarında
              </strong>{" "}
              Etsy Yapay Zeka Tool'una erişebileceklerdir.
            </p>
          </div>

          {/* İkinci Bilgilendirme */}
          <div
            className="p-4 rounded-3 border-start border-4"
            style={{
              backgroundColor: "#fff3cd",
              borderColor: "#ffc107 !important",
            }}
          >
            <div className="d-flex align-items-start gap-3 mb-3">
              <FaCrown
                style={{
                  color: "#ffc107",
                  fontSize: "1.5rem",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              />
              <h6 className="mb-0 fw-bold" style={{ color: "#856404" }}>
                Premium Abonelik Gereklidir
              </h6>
            </div>
            <p
              className="mb-0"
              style={{
                fontSize: "0.95rem",
                lineHeight: "1.6",
                color: "#495057",
              }}
            >
              Etsy Yapay Zeka Tool'larından faydalanabilmek için{" "}
              <strong>OTÜ Premium aboneliğinizin</strong> olması şarttır.
            </p>
          </div>

          {/* Alt Bilgilendirme */}
          <div className="mt-4 pt-3 border-top">
            <p
              className="text-muted small mb-0"
              style={{ fontSize: "0.85rem", lineHeight: "1.5" }}
            >
              <FaInfoCircle className="me-2" style={{ color: "#6c757d" }} />
              Kayıt olurken kullandığınız e-posta adresi önemlidir. Lütfen
              eğitime kayıt olduğunuz mail adresini kullanınız.
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
};

export default RegisterPage;

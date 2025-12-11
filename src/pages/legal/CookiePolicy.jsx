import { Container, Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline-secondary mb-3 d-flex align-items-center gap-2"
          >
            <FaArrowLeft /> Geri Dön
          </button>
          <h1>Çerez Politikası</h1>
          <p className="text-muted">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        <Card>
          <Card.Body className="p-4">
            <section className="mb-4">
              <h3>1. Çerez Nedir?</h3>
              <p>
                Çerezler (cookies), web sitelerini ziyaret ettiğinizde tarayıcınız tarafından cihazınıza 
                (bilgisayar, telefon, tablet) kaydedilen küçük metin dosyalarıdır.
              </p>
              <p>
                Çerezler, web sitelerinin daha verimli çalışmasını sağlar ve site sahiplerine 
                kullanıcı deneyimini iyileştirmek için bilgi sağlar.
              </p>
            </section>

            <section className="mb-4">
              <h3>2. Çerezleri Neden Kullanıyoruz?</h3>
              <p>Sellibra platformunda çerezleri şu amaçlarla kullanıyoruz:</p>
              <ul>
                <li><strong>Kimlik Doğrulama:</strong> Oturum açma durumunuzu hatırlamak</li>
                <li><strong>Güvenlik:</strong> Hesabınızı korumak ve dolandırıcılığı önlemek</li>
                <li><strong>Tercihler:</strong> Dil ve görünüm tercihlerinizi kaydetmek</li>
                <li><strong>Performans:</strong> Site performansını izlemek ve iyileştirmek</li>
                <li><strong>Analitik:</strong> Site kullanımını anlamak ve geliştirmek</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>3. Kullandığımız Çerez Türleri</h3>
              
              <h5 className="mt-4">3.1. Zorunlu Çerezler</h5>
              <p>
                Bu çerezler, web sitesinin temel işlevleri için gereklidir ve kapatılamaz.
              </p>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Çerez Adı</th>
                    <th>Amaç</th>
                    <th>Süre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>session_token</code></td>
                    <td>Oturum açma durumunuzu korur</td>
                    <td>Oturum süresi</td>
                  </tr>
                  <tr>
                    <td><code>auth_token</code></td>
                    <td>Kimlik doğrulama için gerekli</td>
                    <td>7 gün</td>
                  </tr>
                  <tr>
                    <td><code>csrf_token</code></td>
                    <td>Güvenlik - CSRF koruması</td>
                    <td>Oturum süresi</td>
                  </tr>
                  <tr>
                    <td><code>remember_me</code></td>
                    <td>"Beni Hatırla" özelliği</td>
                    <td>30 gün</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">3.2. İşlevsel Çerezler</h5>
              <p>
                Bu çerezler, gelişmiş özellikler ve kişiselleştirme sağlar.
              </p>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Çerez Adı</th>
                    <th>Amaç</th>
                    <th>Süre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>user_preferences</code></td>
                    <td>Tercihlerinizi (tema, dil) saklar</td>
                    <td>90 gün</td>
                  </tr>
                  <tr>
                    <td><code>sidebar_state</code></td>
                    <td>Kenar çubuğu durumunu hatırlar</td>
                    <td>30 gün</td>
                  </tr>
                  <tr>
                    <td><code>notification_dismissed</code></td>
                    <td>Kapatılan bildirimleri takip eder</td>
                    <td>30 gün</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">3.3. Analitik Çerezler</h5>
              <p>
                Bu çerezler, site kullanımını anlamamıza yardımcı olur.
              </p>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Çerez Adı</th>
                    <th>Amaç</th>
                    <th>Süre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>analytics_session</code></td>
                    <td>Kullanıcı oturumlarını izler</td>
                    <td>30 dakika</td>
                  </tr>
                  <tr>
                    <td><code>page_views</code></td>
                    <td>Sayfa görüntülemelerini sayar</td>
                    <td>24 saat</td>
                  </tr>
                  <tr>
                    <td><code>feature_usage</code></td>
                    <td>Özellik kullanımını izler</td>
                    <td>90 gün</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">3.4. Performans Çerezleri</h5>
              <p>
                Bu çerezler, site performansını optimize eder.
              </p>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Çerez Adı</th>
                    <th>Amaç</th>
                    <th>Süre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>cache_version</code></td>
                    <td>Önbellek yönetimi</td>
                    <td>7 gün</td>
                  </tr>
                  <tr>
                    <td><code>load_time</code></td>
                    <td>Yükleme sürelerini ölçer</td>
                    <td>Oturum süresi</td>
                  </tr>
                </tbody>
              </Table>
            </section>

            <section className="mb-4">
              <h3>4. Üçüncü Taraf Çerezleri</h3>
              <p>
                Platformumuz, belirli işlevler için üçüncü taraf hizmetlerini kullanır ve 
                bu hizmetler kendi çerezlerini yerleştirebilir:
              </p>

              <h5 className="mt-3">4.1. OAuth Kimlik Doğrulama (Etsy)</h5>
              <ul>
                <li>Etsy OAuth işlemi sırasında Etsy'nin çerezleri kullanılır</li>
                <li>Bu çerezler Etsy'nin gizlilik politikasına tabidir</li>
                <li>Yalnızca mağaza bağlama işlemi sırasında aktiftir</li>
              </ul>

              <h5 className="mt-3">4.2. AI Servisleri (OpenAI)</h5>
              <ul>
                <li>AI araçlarını kullanırken OpenAI çerezleri kullanılabilir</li>
                <li>Bu çerezler OpenAI gizlilik politikasına tabidir</li>
              </ul>

              <h5 className="mt-3">4.3. PrintNest Entegrasyonu</h5>
              <ul>
                <li>PrintNest iframe içinde kendi çerezlerini kullanır</li>
                <li>Bu çerezler PrintNest politikalarına tabidir</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>5. Çerezleri Nasıl Yönetebilirsiniz?</h3>
              
              <h5 className="mt-3">5.1. Tarayıcı Ayarları</h5>
              <p>
                Çoğu web tarayıcısı, çerezleri otomatik olarak kabul eder, ancak tarayıcı ayarlarınızdan 
                çerezleri kontrol edebilir veya silebilirsiniz:
              </p>
              <ul>
                <li><strong>Google Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                <li><strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
                <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler ve web sitesi verileri</li>
                <li><strong>Edge:</strong> Ayarlar → Gizlilik → Çerezler</li>
              </ul>

              <h5 className="mt-3">5.2. Çerez Reddi</h5>
              <p>
                Zorunlu olmayan çerezleri reddetme seçeneğiniz vardır. Ancak, bazı çerezleri 
                reddetmeniz durumunda:
              </p>
              <ul>
                <li>Bazı özellikler çalışmayabilir</li>
                <li>Tercihleriniz kaydedilmeyebilir</li>
                <li>Site performansı etkilenebilir</li>
                <li>Kişiselleştirilmiş deneyim sağlanamayabilir</li>
              </ul>

              <div className="alert alert-warning mt-3">
                <strong>⚠️ Önemli:</strong> Zorunlu çerezleri devre dışı bırakırsanız, 
                platformu kullanamazsınız çünkü bu çerezler oturum açma ve güvenlik için gereklidir.
              </div>
            </section>

            <section className="mb-4">
              <h3>6. Local Storage ve Session Storage</h3>
              <p>
                Çerezlere ek olarak, tarayıcınızın yerel depolama özelliklerini de kullanırız:
              </p>
              <ul>
                <li><strong>Local Storage:</strong> Tercihlerinizi ve ayarlarınızı saklar</li>
                <li><strong>Session Storage:</strong> Geçici oturum verilerini saklar</li>
              </ul>
              <p>
                Bu veriler yalnızca cihazınızda saklanır ve sunucumuza gönderilmez.
              </p>
            </section>

            <section className="mb-4">
              <h3>7. "Do Not Track" (DNT) Sinyalleri</h3>
              <p>
                Tarayıcınızın "Do Not Track" (İzleme) özelliğini destekliyoruz. DNT etkinse, 
                analitik çerezleri devre dışı bırakılır. Ancak, zorunlu ve işlevsel çerezler 
                hizmet sağlamak için gerekli olduğundan aktif kalmaya devam eder.
              </p>
            </section>

            <section className="mb-4">
              <h3>8. Çerez Politikası Güncellemeleri</h3>
              <p>
                Bu Çerez Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda, 
                sizi bilgilendireceğiz.
              </p>
              <p>
                Son güncelleme tarihi her zaman sayfanın üstünde belirtilir.
              </p>
            </section>

            <section className="mb-4">
              <h3>9. GDPR ve KVKK Uyumu</h3>
              <p>
                Çerez kullanımımız, Avrupa GDPR (Genel Veri Koruma Yönetmeliği) ve Türkiye KVKK 
                (Kişisel Verilerin Korunması Kanunu) gerekliliklerine uygundur.
              </p>
              <ul>
                <li>Zorunlu olmayan çerezler için onay alıyoruz</li>
                <li>Çerez kullanımı hakkında şeffaf bilgi sağlıyoruz</li>
                <li>Çerezleri yönetme ve silme hakkınız var</li>
                <li>Verilerinizi üçüncü taraflarla gerekmedikçe paylaşmıyoruz</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>10. Çerez Onay Yönetimi</h3>
              <p>
                İlk ziyaretinizde, çerez tercihlerinizi belirlemeniz için bir banner gösterilir. 
                Tercihlerinizi şu şekilde yönetebilirsiniz:
              </p>
              <ul>
                <li><strong>Tümünü Kabul Et:</strong> Tüm çerezleri etkinleştirir</li>
                <li><strong>Sadece Zorunlu:</strong> Yalnızca gerekli çerezleri kullanır</li>
                <li><strong>Özelleştir:</strong> Çerez türlerini seçerek özelleştirin</li>
              </ul>
              <p>
                Tercihlerinizi istediğiniz zaman bu sayfadan veya profil ayarlarınızdan değiştirebilirsiniz.
              </p>
            </section>

            <section className="mb-4">
              <h3>11. İletişim</h3>
              <p>Çerez kullanımımız hakkında sorularınız için:</p>
              <ul className="list-unstyled">
                <li><strong>E-posta:</strong> privacy@sellibra.com</li>
                <li><strong>Destek:</strong> support@sellibra.com</li>
                <li><strong>Web:</strong> https://sellibra.com</li>
              </ul>
            </section>

            <div className="alert alert-info mt-5">
              <strong>🍪 Çerezler Hakkında Bilgi:</strong> Çerezler, size daha iyi bir deneyim 
              sunmamıza yardımcı olur. Gizliliğinize saygı duyuyor ve verilerinizi koruyoruz.
            </div>

            <div className="alert alert-success mt-3">
              <strong>✅ Kontrol Sizde:</strong> Çerez tercihlerinizi istediğiniz zaman 
              değiştirebilir ve dilediğiniz gibi yönetebilirsiniz.
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CookiePolicy;


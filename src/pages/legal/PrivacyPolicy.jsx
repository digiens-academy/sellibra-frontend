import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const PrivacyPolicy = () => {
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
          <h1>Gizlilik Politikası</h1>
          <p className="text-muted">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        <Card>
          <Card.Body className="p-4">
            <section className="mb-4">
              <h3>1. Giriş</h3>
              <p>
                Sellibra ("biz", "bizim" veya "Digiens") olarak, kullanıcılarımızın gizliliğine önem veriyoruz. 
                Bu Gizlilik Politikası, kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı, sakladığımızı 
                ve koruduğumuzu açıklar.
              </p>
              <p>
                Hizmetlerimizi kullanarak, bu Gizlilik Politikası'nda açıklanan uygulamaları kabul etmiş olursunuz.
              </p>
            </section>

            <section className="mb-4">
              <h3>2. Topladığımız Bilgiler</h3>
              
              <h5 className="mt-3">2.1. Kişisel Bilgiler</h5>
              <p>Kayıt sırasında ve hizmetlerimizi kullanırken aşağıdaki bilgileri toplayabiliriz:</p>
              <ul>
                <li>Ad ve Soyad</li>
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Şirket/Mağaza bilgileri</li>
              </ul>

              <h5 className="mt-3">2.2. Etsy Entegrasyonu</h5>
              <p>Etsy mağazanızı bağladığınızda, aşağıdaki bilgilere erişim izni isteyebiliriz:</p>
              <ul>
                <li>Mağaza adı ve URL'si</li>
                <li>Ürün listeleri ve detayları</li>
                <li>Sipariş bilgileri (istatistiksel analiz için)</li>
                <li>Mağaza istatistikleri</li>
              </ul>
              <p className="text-muted">
                <strong>Not:</strong> Etsy verilerinize sadece sizin açık izninizle erişiriz ve bu verileri 
                yalnızca size hizmet sağlamak amacıyla kullanırız. Etsy hesap şifrenize hiçbir zaman erişemeyiz.
              </p>

              <h5 className="mt-3">2.3. Teknik Bilgiler</h5>
              <ul>
                <li>IP adresi</li>
                <li>Tarayıcı türü ve versiyonu</li>
                <li>İşletim sistemi</li>
                <li>Oturum bilgileri</li>
                <li>Çerez verileri</li>
              </ul>

              <h5 className="mt-3">2.4. Kullanım Verileri</h5>
              <ul>
                <li>Platforma giriş/çıkış zamanları</li>
                <li>Kullandığınız özellikler</li>
                <li>AI araç kullanım istatistikleri</li>
                <li>PrintNest etkileşim süreleri</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>3. Bilgileri Nasıl Kullanırız</h3>
              <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
              <ul>
                <li><strong>Hizmet Sağlama:</strong> Platform hizmetlerini sunmak ve yönetmek</li>
                <li><strong>Hesap Yönetimi:</strong> Kullanıcı hesaplarını oluşturmak ve yönetmek</li>
                <li><strong>Etsy Entegrasyonu:</strong> Etsy mağazanızla senkronizasyon sağlamak</li>
                <li><strong>AI Araçları:</strong> Yapay zeka destekli özellikler sunmak</li>
                <li><strong>İletişim:</strong> Önemli bildirimler ve destek sağlamak</li>
                <li><strong>Güvenlik:</strong> Platformu ve kullanıcıları korumak</li>
                <li><strong>İyileştirme:</strong> Hizmetlerimizi geliştirmek ve optimize etmek</li>
                <li><strong>Yasal Yükümlülükler:</strong> Yasaların gerektirdiği durumlarda</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>4. Veri Paylaşımı ve Üçüncü Taraflar</h3>
              
              <h5 className="mt-3">4.1. Veri Paylaşımı</h5>
              <p>Kişisel bilgilerinizi aşağıdaki durumlarda paylaşabiliriz:</p>
              <ul>
                <li><strong>Yasal Zorunluluklar:</strong> Mahkeme kararı veya yasal gereklilikler durumunda</li>
                <li><strong>Güvenlik:</strong> Dolandırıcılık ve güvenlik tehditlerini önlemek için</li>
                <li><strong>İş Transferi:</strong> Şirket birleşme veya satışı durumunda</li>
              </ul>

              <h5 className="mt-3">4.2. Üçüncü Taraf Hizmetler</h5>
              <p>Platformumuz aşağıdaki üçüncü taraf hizmetlerini kullanır:</p>
              <ul>
                <li><strong>Etsy API:</strong> Mağaza entegrasyonu için</li>
                <li><strong>PrintNest:</strong> Print-on-demand hizmetleri için</li>
                <li><strong>OpenAI:</strong> Yapay zeka özellikleri için</li>
                <li><strong>Google Sheets:</strong> Veri senkronizasyonu için</li>
              </ul>
              <p className="text-muted">
                Bu servisler kendi gizlilik politikalarına tabidir ve sadece gerekli verileri paylaşırız.
              </p>
            </section>

            <section className="mb-4">
              <h3>5. Veri Güvenliği</h3>
              <p>Verilerinizi korumak için aşağıdaki önlemleri alıyoruz:</p>
              <ul>
                <li>SSL/TLS şifreleme (HTTPS)</li>
                <li>Şifrelerin hash'lenerek saklanması</li>
                <li>Düzenli güvenlik güncellemeleri</li>
                <li>Erişim kontrolü ve yetkilendirme</li>
                <li>Etsy OAuth tokenlarının şifrelenmiş saklanması</li>
                <li>Güvenli sunucu altyapısı</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>6. Çerezler (Cookies)</h3>
              <p>
                Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanır. Çerezler, tarayıcınızda 
                saklanan küçük metin dosyalarıdır.
              </p>
              <h5 className="mt-3">Kullandığımız Çerez Türleri:</h5>
              <ul>
                <li><strong>Zorunlu Çerezler:</strong> Oturum açma ve güvenlik için gerekli</li>
                <li><strong>İşlevsel Çerezler:</strong> Tercihlerinizi hatırlamak için</li>
                <li><strong>Analitik Çerezler:</strong> Kullanım istatistikleri için</li>
              </ul>
              <p>
                Çerezleri tarayıcı ayarlarınızdan yönetebilir veya silebilirsiniz. Ancak, zorunlu çerezleri 
                devre dışı bırakırsanız, bazı özellikler çalışmayabilir.
              </p>
            </section>

            <section className="mb-4">
              <h3>7. Kullanıcı Hakları (GDPR/KVKK)</h3>
              <p>Kullanıcılarımız aşağıdaki haklara sahiptir:</p>
              <ul>
                <li><strong>Erişim Hakkı:</strong> Hangi verilerinizin saklandığını öğrenme</li>
                <li><strong>Düzeltme Hakkı:</strong> Yanlış bilgileri düzeltme</li>
                <li><strong>Silme Hakkı:</strong> Verilerinizin silinmesini talep etme</li>
                <li><strong>Taşınabilirlik Hakkı:</strong> Verilerinizi indirme</li>
                <li><strong>İtiraz Hakkı:</strong> Veri işlemeye itiraz etme</li>
                <li><strong>Sınırlama Hakkı:</strong> Veri işlemenin sınırlanmasını talep etme</li>
              </ul>
              <p>
                Bu haklarınızı kullanmak için <strong>support@sellibra.com</strong> adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </section>

            <section className="mb-4">
              <h3>8. Veri Saklama Süresi</h3>
              <ul>
                <li><strong>Hesap Verileri:</strong> Hesabınız aktif olduğu sürece</li>
                <li><strong>Etsy Verileri:</strong> Bağlantı aktif olduğu sürece</li>
                <li><strong>Kullanım Logları:</strong> 90 gün</li>
                <li><strong>Yedekler:</strong> En fazla 30 gün</li>
              </ul>
              <p>
                Hesabınızı sildiğinizde, tüm kişisel verileriniz 30 gün içinde sistemlerimizden tamamen silinir.
              </p>
            </section>

            <section className="mb-4">
              <h3>9. Çocukların Gizliliği</h3>
              <p>
                Hizmetlerimiz 18 yaş altındaki kişilere yönelik değildir. Bilerek 18 yaş altındaki 
                kişilerden kişisel bilgi toplamıyoruz.
              </p>
            </section>

            <section className="mb-4">
              <h3>10. Uluslararası Veri Transferi</h3>
              <p>
                Verileriniz, sunucularımızın bulunduğu ülkelerde işlenebilir ve saklanabilir. 
                Bu ülkelerin veri koruma yasaları, ülkenizden farklı olabilir.
              </p>
            </section>

            <section className="mb-4">
              <h3>11. Politika Değişiklikleri</h3>
              <p>
                Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda, 
                sizi e-posta veya platform bildirimi ile bilgilendireceğiz.
              </p>
              <p>
                Güncellenmiş politikayı düzenli olarak kontrol etmenizi öneririz.
              </p>
            </section>

            <section className="mb-4">
              <h3>12. İletişim</h3>
              <p>Gizlilik politikamız hakkında sorularınız için:</p>
              <ul className="list-unstyled">
                <li><strong>E-posta:</strong> privacy@sellibra.com</li>
                <li><strong>Destek:</strong> support@sellibra.com</li>
                <li><strong>Web:</strong> https://sellibra.com</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>13. Etsy Özel Hükümler</h3>
              <p>
                Etsy entegrasyonumuz için özel olarak belirtmek isteriz ki:
              </p>
              <ul>
                <li>Etsy verilerinize sadece sizin OAuth onayınızla erişiriz</li>
                <li>Etsy şifrenize hiçbir zaman erişemeyiz</li>
                <li>Etsy verilerini üçüncü taraflarla paylaşmayız</li>
                <li>İstediğiniz zaman Etsy bağlantısını kesebilirsiniz</li>
                <li>Bağlantıyı kestiğinizde, Etsy verileriniz silinir</li>
                <li>Etsy'nin API Kullanım Koşulları'na tam uyum sağlarız</li>
              </ul>
            </section>

            <div className="alert alert-info mt-5">
              <strong>📧 İletişim:</strong> Gizliliğiniz bizim için önemlidir. 
              Herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle iletişime geçin.
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;


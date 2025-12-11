import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TermsOfService = () => {
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
          <h1>Kullanım Koşulları</h1>
          <p className="text-muted">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>

        <Card>
          <Card.Body className="p-4">
            <section className="mb-4">
              <h3>1. Kabul ve Onay</h3>
              <p>
                Sellibra platformuna ("Platform", "Hizmet", "biz" veya "bizim") erişerek ve/veya kullanarak, 
                bu Kullanım Koşulları'nı ("Koşullar") okuduğunuzu, anladığınızı ve bunlara bağlı kalmayı 
                kabul ettiğinizi beyan edersiniz.
              </p>
              <p>
                Bu Koşulları kabul etmiyorsanız, lütfen Platformu kullanmayın.
              </p>
            </section>

            <section className="mb-4">
              <h3>2. Hizmet Tanımı</h3>
              <p>
                Sellibra, Etsy satıcılarına ve print-on-demand girişimcilerine yönelik aşağıdaki hizmetleri sunar:
              </p>
              <ul>
                <li><strong>PrintNest Entegrasyonu:</strong> Print-on-demand hizmetlerine kolay erişim</li>
                <li><strong>Etsy AI Tools:</strong> Yapay zeka destekli ürün başlığı, açıklama oluşturma</li>
                <li><strong>Design Tools:</strong> Mockup oluşturma, arka plan silme, AI tasarım araçları</li>
                <li><strong>Etsy Mağaza Entegrasyonu:</strong> Etsy mağazanızı platformumuza bağlama</li>
                <li><strong>Kar Hesaplama:</strong> Ürün karlılık hesaplayıcı</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>3. Hesap Oluşturma ve Güvenlik</h3>
              
              <h5 className="mt-3">3.1. Hesap Gereksinimleri</h5>
              <ul>
                <li>18 yaşından büyük olmalısınız</li>
                <li>Doğru ve güncel bilgiler sağlamalısınız</li>
                <li>Her kullanıcı yalnızca bir hesap oluşturabilir</li>
                <li>Hesabınızın güvenliğinden siz sorumlusunuz</li>
              </ul>

              <h5 className="mt-3">3.2. Hesap Güvenliği</h5>
              <ul>
                <li>Şifrenizi kimseyle paylaşmayın</li>
                <li>Güçlü bir şifre kullanın</li>
                <li>Yetkisiz erişimi derhal bize bildirin</li>
                <li>Hesabınızda yapılan tüm aktivitelerden siz sorumlusunuz</li>
              </ul>

              <h5 className="mt-3">3.3. Hesap Askıya Alma ve Kapatma</h5>
              <p>Aşağıdaki durumlarda hesabınızı askıya alabilir veya kapatabilir:</p>
              <ul>
                <li>Kullanım Koşulları'nın ihlali</li>
                <li>Dolandırıcılık veya kötüye kullanım</li>
                <li>Ödeme sorunları (premium abonelikler için)</li>
                <li>Yasal gereklilikler</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>4. Abonelik ve Ödeme</h3>
              
              <h5 className="mt-3">4.1. Ücretsiz Hizmetler</h5>
              <p>
                PrintNest entegrasyonu temel düzeyde ücretsiz olarak sunulmaktadır.
              </p>

              <h5 className="mt-3">4.2. Premium Hizmetler</h5>
              <ul>
                <li>Etsy AI Tools premium abonelik gerektirir</li>
                <li>Abonelik ücretleri aylık veya yıllık olarak tahsil edilir</li>
                <li>Otomatik yenileme aktiftir (iptal edilene kadar)</li>
                <li>Fiyatlar önceden bildirimde bulunularak değiştirilebilir</li>
              </ul>

              <h5 className="mt-3">4.3. İptal ve İade</h5>
              <ul>
                <li>Aboneliğinizi istediğiniz zaman iptal edebilirsiniz</li>
                <li>İptal sonrası, mevcut dönem sonuna kadar erişiminiz devam eder</li>
                <li>İade politikamız için support@sellibra.com ile iletişime geçin</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>5. Kullanım Kuralları</h3>
              
              <h5 className="mt-3">5.1. İzin Verilen Kullanım</h5>
              <ul>
                <li>Platformu yasal ticari faaliyetler için kullanabilirsiniz</li>
                <li>Etsy mağazanızı bağlayabilirsiniz</li>
                <li>AI araçlarını ürün geliştirme için kullanabilirsiniz</li>
                <li>PrintNest ile ürün siparişi verebilirsiniz</li>
              </ul>

              <h5 className="mt-3">5.2. Yasak Davranışlar</h5>
              <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
              <ul>
                <li>Platformu yasadışı amaçlarla kullanmak</li>
                <li>Başkalarının hesaplarına yetkisiz erişim</li>
                <li>Spam veya otomatik bot kullanımı</li>
                <li>Telif hakkı ihlali içeren içerik oluşturmak</li>
                <li>Platformu tersine mühendislik yapmak</li>
                <li>API'leri kötüye kullanmak veya aşırı yükleme</li>
                <li>Diğer kullanıcıları rahatsız etmek veya taciz etmek</li>
                <li>Yanlış veya yanıltıcı bilgi vermek</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>6. Etsy Entegrasyonu</h3>
              
              <h5 className="mt-3">6.1. Bağlantı ve Yetkilendirme</h5>
              <ul>
                <li>Etsy mağazanızı OAuth protokolü ile güvenli şekilde bağlarsınız</li>
                <li>Bağlantı için gerekli izinleri Etsy'de onaylamalısınız</li>
                <li>İstediğiniz zaman bağlantıyı kesebilirsiniz</li>
              </ul>

              <h5 className="mt-3">6.2. Etsy Kullanım Koşulları</h5>
              <p>
                Etsy entegrasyonunu kullanırken, Etsy'nin kendi Kullanım Koşulları ve API Politikası'na 
                da uymayı kabul edersiniz. Bu şunları içerir:
              </p>
              <ul>
                <li>Etsy'nin Satıcı Politikası'na uyum</li>
                <li>Telif haklarına ve fikri mülkiyet haklarına saygı</li>
                <li>Yasaklı ürün kategorilerinden kaçınma</li>
                <li>Etsy'nin marka kullanım kurallarına uyma</li>
              </ul>

              <h5 className="mt-3">6.3. Veri Kullanımı</h5>
              <p>
                Etsy mağaza verilerinizi yalnızca size hizmet sağlamak için kullanırız ve 
                Gizlilik Politikamız'da belirtilen şekilde işleriz.
              </p>
            </section>

            <section className="mb-4">
              <h3>7. Fikri Mülkiyet Hakları</h3>
              
              <h5 className="mt-3">7.1. Platform İçeriği</h5>
              <p>
                Platform, logo, tasarım, yazılım ve diğer tüm içerikler Sellibra'nın veya 
                lisans verenlerinin mülkiyetindedir.
              </p>

              <h5 className="mt-3">7.2. Kullanıcı İçeriği</h5>
              <ul>
                <li>Oluşturduğunuz içeriğin telif haklarına sahipsiniz</li>
                <li>Platformu kullanarak, hizmet sağlamak için gerekli lisansları bize verirsiniz</li>
                <li>İçeriğinizin yasal ve telif hakkı ihlali içermediğinden siz sorumlusunuz</li>
              </ul>

              <h5 className="mt-3">7.3. AI Oluşturulan İçerik</h5>
              <p>
                AI araçlarımızla oluşturduğunuz içerik size aittir, ancak:
              </p>
              <ul>
                <li>İçeriğin orijinalliğini garanti edemeyiz</li>
                <li>Ticari kullanım öncesi kontrol etmeniz önerilir</li>
                <li>Telif hakkı sorumluluğu size aittir</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>8. Sorumluluk Sınırlamaları</h3>
              
              <h5 className="mt-3">8.1. Hizmet Garantisi</h5>
              <p>
                Platform "olduğu gibi" sunulmaktadır. Aşağıdakileri garanti etmeyiz:
              </p>
              <ul>
                <li>Kesintisiz hizmet</li>
                <li>Hatasız çalışma</li>
                <li>Belirli sonuçlar elde etme</li>
                <li>Üçüncü taraf servislerin (Etsy, PrintNest) kesintisiz çalışması</li>
              </ul>

              <h5 className="mt-3">8.2. Sorumluluk Reddi</h5>
              <p>
                Aşağıdakilerden sorumlu değiliz:
              </p>
              <ul>
                <li>Veri kaybı</li>
                <li>Kar kaybı veya iş kayıpları</li>
                <li>Üçüncü taraf hizmetlerindeki sorunlar</li>
                <li>AI araçlarının ürettiği içeriğin kalitesi</li>
                <li>Etsy veya PrintNest platformlarındaki sorunlar</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>9. Veri Yedekleme</h3>
              <p>
                Verilerinizi korumak için çaba gösteririz, ancak kendi yedeklerinizi almanızı öneririz. 
                Veri kaybından sorumlu değiliz.
              </p>
            </section>

            <section className="mb-4">
              <h3>10. Üçüncü Taraf Bağlantılar ve Hizmetler</h3>
              <ul>
                <li>Platform üçüncü taraf websitelerine bağlantılar içerebilir</li>
                <li>Bu sitelerin içeriğinden sorumlu değiliz</li>
                <li>Etsy, PrintNest ve OpenAI kendi koşullarına tabidir</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>11. Değişiklikler ve Güncellemeler</h3>
              <p>
                Bu Kullanım Koşulları'nı önceden bildirimde bulunarak değiştirebiliriz. 
                Önemli değişiklikler için e-posta bildirimi göndereceğiz.
              </p>
              <p>
                Değişikliklerden sonra Platformu kullanmaya devam ederseniz, yeni koşulları 
                kabul etmiş sayılırsınız.
              </p>
            </section>

            <section className="mb-4">
              <h3>12. Hizmet Sonu</h3>
              <p>
                Platformu herhangi bir zamanda, herhangi bir nedenle, önceden bildirimle veya 
                bildirimsiz olarak sonlandırma veya değiştirme hakkımız saklıdır.
              </p>
            </section>

            <section className="mb-4">
              <h3>13. Uygulanacak Hukuk</h3>
              <p>
                Bu Koşullar, Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar, 
                İstanbul mahkemelerinde çözülecektir.
              </p>
            </section>

            <section className="mb-4">
              <h3>14. İletişim ve Destek</h3>
              <ul className="list-unstyled">
                <li><strong>E-posta:</strong> support@sellibra.com</li>
                <li><strong>Genel Sorular:</strong> info@sellibra.com</li>
                <li><strong>Yasal Konular:</strong> legal@sellibra.com</li>
                <li><strong>Web:</strong> https://sellibra.com</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3>15. Çeşitli Hükümler</h3>
              
              <h5 className="mt-3">15.1. Tam Anlaşma</h5>
              <p>
                Bu Koşullar, sizinle Sellibra arasındaki tam anlaşmayı oluşturur.
              </p>

              <h5 className="mt-3">15.2. Feragat</h5>
              <p>
                Herhangi bir hakkımızdan feragat etmememiz, o haktan vazgeçtiğimiz anlamına gelmez.
              </p>

              <h5 className="mt-3">15.3. Bölünebilirlik</h5>
              <p>
                Herhangi bir hükmün geçersiz sayılması durumunda, diğer hükümler geçerliliğini korur.
              </p>

              <h5 className="mt-3">15.4. Devir</h5>
              <p>
                Bu Koşullar'dan doğan haklarınızı devredemezsiniz. Biz haklarımızı devredebiliriz.
              </p>
            </section>

            <div className="alert alert-warning mt-5">
              <strong>⚠️ Önemli:</strong> Bu Kullanım Koşulları'nı düzenli olarak kontrol edin. 
              Platformu kullanmaya devam ederek, güncel koşulları kabul etmiş olursunuz.
            </div>

            <div className="alert alert-info mt-3">
              <strong>📧 Sorularınız mı var?</strong> Kullanım koşulları hakkında herhangi bir 
              sorunuz varsa, lütfen support@sellibra.com adresinden bizimle iletişime geçin.
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TermsOfService;


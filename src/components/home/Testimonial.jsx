import { FaStar } from 'react-icons/fa';
import { AvatarImages } from '../../assets/assets';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Ayşe Yılmaz',
      role: 'Etsy Satıcısı',
      avatar: AvatarImages.avatar1,
      comment: 'Sellibra sayesinde işlerimi çok daha hızlı ve verimli yönetiyorum. AI araçları gerçekten işimi kolaylaştırdı!',
      rating: 5
    },
    {
      id: 2,
      name: 'Mehmet Kaya',
      role: 'Print-on-Demand Girişimcisi',
      avatar: AvatarImages.avatar2,
      comment: 'Sellibra mükemmel çalışıyor. Tasarımlarımı hızlıca yapabiliyorum ve müşterilerime daha iyi hizmet veriyorum.',
      rating: 5
    },
    {
      id: 3,
      name: 'Hüseyin Demir',
      role: 'Dijital Tasarımcı',
      avatar: AvatarImages.avatar3,
      comment: 'AI destekli tasarım araçları sayesinde ürün görsellerimi çok daha hızlı hazırlıyorum. Kesinlikle tavsiye ederim!',
      rating: 5
    }
  ];

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <h2 className="testimonial-heading">
          Kullanıcılarımız Ne Diyor?
        </h2>
        <p className="testimonial-subheading">
          Binlerce kullanıcı Sellibra Etsy PRO ile işlerini büyütüyor
        </p>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-avatar">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="avatar-image"
                />
              </div>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="star" style={{ color: '#FFD700' }} />
                ))}
              </div>
              <p className="testimonial-comment">"{testimonial.comment}"</p>
              <div className="testimonial-author">
                <h4 className="author-name">{testimonial.name}</h4>
                <p className="author-role">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;


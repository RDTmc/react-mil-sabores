import { Link } from 'react-router-dom';
import { FaTrophy, FaBirthdayCake, FaTruck, FaGraduationCap } from "react-icons/fa";

export default function Benefits() {
  return (
    <section class="seccion-beneficios">
        <div class="banner">
            <h2 class="titulo-destacado">¿Por Qué Elegir Mil Sabores?</h2>
            <div class="banner-grid">
                <div class="banner-card">
                    <div class="banner-icon">
                        <FaTrophy />
                    </div>
                    <h3>Récord Guinness</h3>
                    <p>Participamos en la creación de la torta más grande del mundo en 1995. Experiencia y calidad garantizada.</p>
                </div>
                <div class="banner-card">
                    <div class="banner-icon">
                        <FaBirthdayCake />
                    </div>
                    <h3>Personalización Total</h3>
                    <p>Cada torta puede ser personalizada con mensajes especiales para hacer tu celebración única.</p>
                </div>
                <div class="banner-card">
                    <div class="banner-icon">
                        <FaTruck />
                    </div>
                    <h3>Entrega Programada</h3>
                    <p>Elige la fecha perfecta para tu evento. Seguimiento en tiempo real de tu pedido.</p>
                </div>
                <div class="banner-card">
                    <div class="banner-icon">
                        <FaGraduationCap />
                    </div>
                    <h3>Formamos Talento</h3>
                    <p>Apoyamos a estudiantes de gastronomía con recetas, consejos y oportunidades de crecimiento.</p>
                </div>
            </div>
        </div>
    </section>
  );
}
// contactoloja.jsx
import styles from "../css/public/ContactoLoja.module.css";

import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../componentes/Navbar";
import SubContactosNav from "../componentes/SubContactosNav";

function ContactoLoja({ user, handleLogout }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    setFormData({ nome: "", email: "", mensagem: "" });
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <SubContactosNav/>
      <main className={styles.contactoContainer}>
        <section className={styles.heroSection}>
          <h1>Fale Connosco</h1>
          <p>Tem dúvidas? Quer fazer uma sugestão ou reclamação? Estamos aqui para ouvir você.</p>
          <Link to="/perfil-contactos">Contacta-nos</Link>
        </section>

        <section className={styles.sobreNosSection}>
          <h2>Sobre Nós</h2>
          <p>
            Bem-vindo à nossa loja! Somos apaixonados por tecnologia e comprometidos em oferecer os melhores produtos e atendimento de excelência.
            Desde computadores a acessórios, trabalhamos com marcas de confiança para garantir qualidade e satisfação.
            Valorizamos cada cliente e estamos aqui para ajudar com qualquer dúvida ou necessidade. Obrigado por escolher a nossa loja!
          </p>
        </section>

        <section className={styles.infoSection}>
          <h2>Informações da Loja</h2>
          <p><strong>Telefone:</strong> +351 912 345 678</p>
          <p><strong>Email:</strong> apoio@exemplo.pt</p>
          <p><strong>Morada:</strong> Rua das Flores, 123, Lisboa</p>
        </section>

        <section className={styles.mapSection}>
          <h2>Onde estamos?</h2>
          <iframe
            title="Localização Loja"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.6822637376095!2d-9.142685284424728!3d38.73694697959567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19338c9f246b5d%3A0x43e2942581c1cf8d!2sRua%20das%20Flores%20123%2C%20Lisboa!5e0!3m2!1spt-PT!2spt!4v1681111111111!5m2!1spt-PT!2spt"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </main>
    </>
  );
}

export default ContactoLoja;

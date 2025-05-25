import { Link } from "react-router-dom";
import styles from "../css/componente/ComponentesNav.module.css";

function ComponentesNav() {
  const componentes = [
    { nome: "Memória", img: "https://imgs.search.brave.com/rXpxg8ONb5XBradhEcanVOF5I9mD7xTF2uMl584b71c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vdk9wb0dL/MDZwZGo2RW12bnBf/RXF1QXhIMExhYXgz/TGVaWWF0RzNsNzZI/NC9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlv/ZEhSdy9NaTV0YkhO/MFlYUnBZeTVqL2Iy/MHZSRjlSWDA1UVh6/SlkvWHpjeE1UUXpO/eTFOVEZVMy9Nall6/TmpVME1UUTRNVjh4/L01USXdNak10Vmk1/M1pXSnc" },
    { nome: "Processador", img: "https://imgs.search.brave.com/cVrWpZZpZmSY8S7FxATtAnFKD1OECqvHEdGJRy3UDFY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vNG1xSTZG/a3lmaEpCSFRfOTA1/OWM2blFVTzVSQm15/ZXFLM29GVVRHQVc3/NC9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTkz/ZDNjdS9ZVzVrY205/cFpHRjFkR2h2L2Nt/bDBlUzVqYjIwdmQz/QXQvWTI5dWRHVnVk/QzkxY0d4di9ZV1J6/THpJd01qRXZNRFF2/L1FVMUVMVko1ZW1W/dUxYQnkvYjJObGMz/TnZjaTVxY0dj" },
    { nome: "Placa Gráfica", img: "https://imgs.search.brave.com/RnTj7fvzBmbptPs1wveS5jpiPRyuVPEmzD6K5t64LC4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vM2Jld1ln/MUg5TW04a3RSUlNk/bGM0TGJLaEJmWm9a/eDJRdkdnRE1Ba00w/Yy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlq/Wkc0dS9iVzl6TG1O/dGN5NW1kWFIxL2Nt/VmpaRzR1Ym1WMEwz/Qk4vY1U1V2FVcFpP/VUpGVGxwWC9Za3Qy/V25aa1p6Z3VhbkJu" },
    { nome: "MotherBoard", img: "https://imgs.search.brave.com/EknBsdbhgGevsusglqtItqjQlowC12cri7lXAmh_qRk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vNEdtc1Uw/a2RYcFVBUThoS0tB/S2RHLVlDbE1VbUhC/MGNGMXNHeFRNQXFN/OC9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTl6/ZEc5eS9ZV2RsTFdG/emMyVjBMbTF6L2FT/NWpiMjB2WlhabGJu/UXYvTWpBeU5DOURU/a1F2WVcwMS9MV0Zw/TFdkaGJXbHVaeTF0/L2IzUm9aWEppYjJG/eVpDOXAvYldGblpY/TXZiWE5wTFcxdy9a/MTk0T0Rjd1pWOWxa/R2RsL1gzUnBYM2Rw/Wm1rdE0yUXovWDNK/bllpNXdibWM" },
    { nome: "Armazenamento", img: "https://imgs.search.brave.com/7z5DP89dx8PeA_v8w_Md7nc5PhXaxHZy7-xeYjopV0g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vUldyRy1u/REpzbzIyWnhFenRY/UlloeEVCcTlKNXls/UlQ5MFpGWDJ4VXRO/by9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/YldGbi9aWE10Ym1F/dWMzTnNMV2x0L1lX/ZGxjeTFoYldGNmIy/NHUvWTI5dEwybHRZ/V2RsY3k5Si9Memd4/VjNWSE5teFJkVVJN/L0xtcHdadw" },
    { nome: "Fonte de Alimentação", img: "https://lian-li.com/wp-content/uploads/2024/07/edge_006.jpg" },
    { nome: "Caixa", img: "https://imgs.search.brave.com/v7TlyDUjN3ZWnjufLFSgpaqIO4Z5d1KbTwVj3LRZQDc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vRmxvWEdP/bDJhZzV0V2o3aVNy/d1NwLWd3XzNuc3lf/XzI5cjNHTEF3cFdn/MC9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/YldjdS9kR1Z5WVdK/NWRHVnphRzl3L0xt/TnZiUzVpY2k5d2Nt/OWsvZFhSdkwzQXZa/MkZpYVc1bC9kR1V0/WjJGdFpYSXRZMjl5/L2MyRnBjaTAyTlRB/d1pDMWgvYVhJdFpt/eHZkeTF0YVdRdC9k/RzkzWlhJdGJXVnph/QzEyL2FXUnlieTEw/Wlcxd1pYSmgvWkc4/dFpTMWhkSGd0YzJW/dC9MV1poYmkxM2FH/bDBaUzFqL1l5MDVN/REV4TWpZd0xYZDMv/WHpJd05qTTVOaTVx/Y0dj" },
    { nome: "Monitor", img: "https://imgs.search.brave.com/iTyaPHhwaiBsyAP7rOQACZUe4dZKgutpTlzB9yoZlDE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vOHdaSE9T/MVkxbmpKTFZvRXZN/d2RrR1VaQ0g4Ul82/TVZYcDlrRVJVNDlD/TS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/TlM1My9ZV3h0WVhK/MGFXMWhaMlZ6L0xt/TnZiUzl6Wlc4dlRW/TkovTFUxQlJ5MHlO/VFZZUmxZdC9NalV0/UTJ4aGMzTXRSblZz/L2JDMUlSQzFIWVcx/cGJtY3QvVEVWRUxV/MXZibWwwYjNJdC9N/VFl0T1MxTlpYUmhi/R3hwL1l5MUNiR0Zq/YXkweU5DMDEvTFZa/cFpYZGhZbXhsTFZK/aC9jR2xrTFZabGNu/UnBZMkZzL0xVRnNh/V2R1YldWdWRDMVcv/UVMxTVJVUXRRbUZq/YTJ4cC9aMmgwTFRF/NU1qQXRlQzB4L01E/Z3dMVEUyTFRjdFRX/bHMvYkdsZk9UUXhN/RGc1WXpVdC9OakJt/WVMwMFlUZ3lMVGd5/L1lUUXRNbVJpTkdZ/ME1ESXkvTkRReExt/WmlORGxtTkRRei9a/alJqTlRCa01URTJa/VFkzL1l6azNPRGxo/TkRCalltSXgvTG1w/d1pXY19iMlJ1U0dW/cC9aMmgwUFRVNE1D/WnZaRzVYL2FXUjBh/RDAxT0RBbWIyUnUv/UW1jOVJrWkdSa1pH" },
    { nome: "Periféricos", img: "/icons/benfica.jpg" },
  ];

  return (
    <div className={styles.navContainer}>
      {componentes.map((item, index) => (
        <Link
          key={index}
          to={`/produtos?tipo_produto=${encodeURIComponent(item.nome)}`}
          className={styles.navItem}
        >
          <img src={item.img} alt={item.nome} className={styles.icon} />
          <span>{item.nome}</span>
        </Link>
      ))}
    </div>
  );
}

export default ComponentesNav;

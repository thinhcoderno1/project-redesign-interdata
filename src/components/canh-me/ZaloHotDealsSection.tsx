/* eslint-disable @next/next/no-img-element */
import { withAssetPrefix } from "./assets";

export default function ZaloHotDealsSection() {
  return (
    <section className="cm-section cm-zalo-section">
      <div className="cm-zalo-card">
        <div className="cm-zalo-content">
          <div className="cm-pill">Zalo Hot Deals</div>
          <h2>Tham gia nhóm Zalo Hot Deals của InterData</h2>
          <p>
            Quét mã QR bằng Zalo để theo dõi các chương trình VPS, Cloud Server
            và Hot Deals mới ngay khi được cập nhật.
          </p>
          <a
            className="cm-zalo-button"
            href="https://zalo.me/g/ingoza480"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            THAM GIA NGAY
          </a>
        </div>
        <div className="cm-zalo-qr-wrap">
          <img
            src={withAssetPrefix("/qr-code-zalo-interdata.jpg")}
            alt="Mã QR tham gia nhóm Zalo Hot Deals của InterData"
            className="cm-zalo-qr"
          />
        </div>
      </div>
    </section>
  );
}

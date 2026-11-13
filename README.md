# Goaloo Total

Mobil uyumlu Goaloo tarihsel maç arşivi görüntüleyicisi.

## GitHub Pages'i etkinleştirme

1. Depoda **Settings → Pages** bölümünü açın.
2. **Build and deployment** altında **Deploy from a branch** seçin.
3. Branch olarak **main**, klasör olarak **/(root)** seçip **Save**'e basın.
4. Yayın adresi: https://lunnessa777-hue.github.io/Luni_34GS/

## Kullanım

- Goaloo 1X2 Odds URL'sini ve tarih aralığını girin.
- Tarama düğmesi, özel tarama deposundaki GitHub Actions sayfasını açar. URL ve tarihleri Actions formuna ayrıca girin.
- Tarama tamamlanınca `goaloo-total-results` artifact'ini indirin.
- ZIP içindeki `results.json` dosyasını sayfadaki sonuç yükleme alanından seçin.
- Bookmaker araması ve tarih filtreleriyle kayıtları daraltın.

## Önemli

Bu sayfa herkese açıktır. Tarama motoru, GitHub Actions iş akışı ve sonuç artifact'leri özel `goaloo-bet365` deposunda kalır. Bu statik sayfa doğrudan tarama başlatan bir backend değildir; güvenli sunucu tarafı entegrasyonu ayrıca kurulmalıdır. GitHub erişim anahtarınızı asla bu depoya veya tarayıcı JavaScript'ine eklemeyin.

Kişisel Goaloo maç URL'si veya tarama sonuçları bu depoya eklenmemiştir.

# Goaloo Total

Mobil uyumlu Goaloo tarihsel maç arşivi görüntüleyicisi ve güvenli tarama arayüzü.

## GitHub Pages (salt görüntüleme)

1. Depoda **Settings → Pages** bölümünü açın.
2. **Build and deployment** altında **Deploy from a branch** seçin.
3. Branch olarak **main**, klasör olarak **/(root)** seçip **Save**'e basın.
4. Yayın adresi: https://lunnessa777-hue.github.io/Luni_34GS/

GitHub Pages sürümü JSON sonuçlarını yükleyip görüntüler. Güvenlik nedeniyle özel GitHub Actions iş akışını doğrudan tarayıcıdan çağıran bir token içermez.

## Otomatik tarama backend'i (Vercel)

Aynı public depoyu Vercel'e bağlayarak statik arayüz ve API uç noktalarını birlikte yayımlayın:

1. Vercel'de **New Project → Import Git Repository** yolunu izleyip `lunnessa777-hue/Luni_34GS` deposunu seçin.
2. Framework Preset: **Other**. Root Directory: `./`. Build komutu gerekmiyorsa boş bırakın.
3. İlk deploy'dan sonra **Project → Settings → Environment Variables** bölümünde aşağıdaki iki Production değişkenini ekleyin:
   - `GITHUB_TOKEN`: Yalnızca özel `goaloo-bet365` deposuna erişen fine-grained GitHub token. Repository permissions altında **Actions: Read and write** seçin. Başka depo seçmeyin.
   - `APP_PASSWORD`: Kendinizin belirlediği, uzun ve tahmin edilmesi zor bir erişim parolası. Bu parolayı GitHub'a veya bu public depoya yazmayın.
4. Değişkenleri kaydettikten sonra **Redeploy** yapın.
5. Vercel'in verdiği `https://....vercel.app` adresini açın. Goaloo URL'si, tarih aralığı ve `APP_PASSWORD` değerini girip **Taramayı Başlat** düğmesine basın.
6. Backend, özel depodaki `goaloo.yml` workflow'unu başlatır; ilerlemeyi sorgular; tamamlanınca `goaloo-total-results` artifact'inden `results.json` dosyasını alıp ekranda gösterir.

**Güvenlik:** GitHub token'ı yalnızca Vercel Environment Variables içinde tutulur; istemciye gönderilmez. Token'ı sohbet mesajına, HTML/JavaScript'e veya Git deposuna yapıştırmayın. `APP_PASSWORD` yalnızca tarama API'sine erişimi sınırlar; Vercel projesini ve public kaynak kodunu özel yapmaz.

## Kullanım ve kısıtlar

- Tarama kapsamı: **1X2 Odds / Initial / Total**.
- Sonuç alanları: lig, tarih, ev sahibi, skor, deplasman ve 1X2 W/D/L.
- Tarama, GitHub Actions üzerinde çalıştığı için birkaç dakika sürebilir.
- GitHub Actions ücretsiz kullanım kotası ve Vercel Hobby plan limitleri geçerlidir; sınırsız çalışma garantisi yoktur.
- Artifact saklama süresi 7 gündür; API sonucu tarama tamamlandıktan sonra alır.

## Gizlilik

Bu depo herkese açıktır. Kaynak kodu ve arayüz herkes tarafından görülebilir. GitHub token'ı, erişim parolası, kişisel Goaloo maç URL'si veya tarama sonuçları depoya eklenmemelidir.

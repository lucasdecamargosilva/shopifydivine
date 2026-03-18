(function () {
    console.log("🔥 [Provador IA] Script carregado no navegador! Iniciando configurações...");

    // ===============================================
    // 0. CHUMBAR A API KEY AQUI DIRETO NO CÓDIGO
    // ===============================================
    const apiKey = "pl_live_15a24237440a8bf4622abd737a98b3c6fb28a53428db883a89a71795f136c8fb";
    window.PROVOU_LEVOU_API_KEY = apiKey;

    // 1. Injetar Fontes e Ícones Globais
    if (!document.querySelector('link[href*="Outfit"]')) {
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    }
    if (!document.querySelector('script[src*="phosphor-icons"]')) {
        const iconScript = document.createElement('script');
        iconScript.src = 'https://unpkg.com/@phosphor-icons/web';
        document.head.appendChild(iconScript);
    }

    // 2. Injetar o CSS
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --q-quantic: #8b5cf6; --q-quantic-dark: #7c3aed; }
        .q-btn-trigger-ia { position: absolute; top: 15px; right: 20px; z-index: 10; background: linear-gradient(135deg, var(--q-quantic) 0%, var(--q-quantic-dark) 100%); color: #ffffff; border: 2px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 50px; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow: hidden; }
        .q-btn-trigger-ia i { font-size: 16px; }
        .q-btn-trigger-ia:hover { transform: scale(1.05) translateY(-1px); box-shadow: 0 12px 25px rgba(139, 92, 246, 0.6); }
        .q-btn-trigger-ia::after { content: ''; position: absolute; top: -50%; left: -60%; width: 20%; height: 200%; background: rgba(255, 255, 255, 0.4); transform: rotate(30deg); animation: q-shimmer 3.5s infinite; }
        .q-animate-attention { animation: q-button-pulse 2.5s infinite; }
        @keyframes q-button-pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.6); } 70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); } }
        @keyframes q-shimmer { 0% { left: -60%; } 15% { left: 120%; } 100% { left: 120%; } }
        @media (max-width: 768px) { .q-btn-trigger-ia { right: 35px; top: 20px; padding: 10px 20px; font-size: 13px; } }

        #q-modal-ia { display: none; position: fixed; inset: 0; background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 99999; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; }
        .q-card-ia { background: #ffffff; width: 93%; max-width: 440px; border-radius: 32px; padding: 0; position: relative; color: #000; border: 1px solid #f1f5f9; box-shadow: 0 25px 60px rgba(0,0,0,0.12); max-height: 94vh; display: flex; flex-direction: column; overflow: hidden; }
        .q-content-scroll { padding: 25px 20px; overflow-y: auto; flex: 1; text-align: center; }
        .q-close-ia { position: absolute; top: 15px; right: 15px; background: none; border: none; color: #cbd5e1; cursor: pointer; font-size: 30px; z-index: 100; }

        .q-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f8fafc; padding: 15px; border-radius: 20px; margin: 15px 0; }
        .q-tip-item { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 9px; font-weight: 700; text-transform: uppercase; color: #475569; }
        .q-tip-item i { color: var(--q-quantic); font-size: 24px; }
        .q-lead-form { margin: 20px 0; display: flex; flex-direction: column; gap: 12px; text-align: left; }
        .q-group label { display: block; font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 5px; text-transform: uppercase; }
        .q-input { width: 100%; padding: 14px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 15px; font-family: 'Outfit'; font-weight: 600; box-sizing: border-box;}
        
        .q-btn-black { background: #000; color: #fff; border: none; width: 100%; padding: 18px; border-radius: 16px; font-weight: 700; font-size: 16px; cursor: pointer; margin-top: 10px; transition: 0.3s; }
        .q-btn-black:disabled { background: #cbd5e1; cursor: not-allowed; }
        .q-btn-buy { background: #10b981; color: #fff; border: none; width: 100%; padding: 18px; border-radius: 16px; font-weight: 800; font-size: 16px; cursor: pointer; margin-bottom: 10px; }
        .q-btn-outline { background: #fff; color: #000; border: 1px solid #e2e8f0; width: 100%; padding: 18px; border-radius: 16px; font-weight: 700; font-size: 16px; cursor: pointer; }
        .q-status-msg { display:none; font-size: 12px; color: #ef4444; font-weight: 700; text-align: center; padding: 15px; background: #fef2f2; border-radius: 14px; margin-bottom: 15px; border: 1px solid #fee2e2; }
        .q-loader-ui { display:none; padding: 40px 0; }
        .q-powered-footer { padding: 8px 0 15px 0; display: flex; justify-content: center; align-items: center; gap: 5px;}
        .q-quantic-logo { height: 14px; filter: brightness(0); }
        @keyframes q-slide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

        /* SELETOR DE FOTOS DO PRODUTO */
        .q-prod-picker { display: flex; gap: 10px; justify-content: center; margin: 15px 0; }
        .q-prod-thumb { width: 80px; height: 80px; border-radius: 14px; overflow: hidden; border: 2px solid #e2e8f0; cursor: pointer; transition: 0.2s; flex-shrink: 0; }
        .q-prod-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .q-prod-thumb:hover { border-color: var(--q-quantic); transform: scale(1.05); }
        .q-prod-thumb.q-selected { border-color: var(--q-quantic); box-shadow: 0 0 0 3px rgba(139,92,246,0.25); }
    `;
    document.head.appendChild(style);

    // 3. Injetar o Modal no body
    const modalContainer = document.createElement('div');
    modalContainer.id = 'q-modal-ia';
    modalContainer.innerHTML = `
        <div class="q-card-ia">
            <button type="button" class="q-close-ia" id="q-modal-close-btn">&times;</button>
            
            <div class="q-content-scroll">
                <div id="q-header-provador">
                    <h1 style="margin:0 0 20px 0; font-size:24px; font-weight:800; letter-spacing:-0.5px">Provador Virtual Calmô ✨</h1>
                </div>

                <div id="q-step-upload">
                    <div id="q-limit-alert" class="q-status-msg">Você atingiu o limite de 2 testes por dia. Volte amanhã!</div>
                    <!-- ALERTA DE CHAVE/BLOQUEIO ADICIONADO AQUI -->
                    <div id="q-block-alert" class="q-status-msg" style="background:#fee2e2; color:#b91c1c;">Provas virtuais indisponíveis nesta loja no momento.</div>

                    <div id="q-form-container">
                        <div class="q-lead-form">
                            <div class="q-group">
                                <label>Seu WhatsApp (Obrigatório)</label>
                                <input type="tel" id="q-phone" class="q-input" placeholder="(11) 99999-9999" maxlength="15">
                                <div id="q-phone-error" class="q-status-msg" style="margin-top:5px; padding:5px;">Celular inválido.</div>
                            </div>
                            <div class="q-input-row" style="display:flex; gap:10px;">
                                <div class="q-group" style="flex:1">
                                    <label>Altura (cm)</label>
                                    <input type="text" id="q-h-val" class="q-input" placeholder="175">
                                </div>
                                <div class="q-group" style="flex:1">
                                    <label>Peso (kg)</label>
                                    <input type="text" id="q-w-val" class="q-input" placeholder="80">
                                </div>
                            </div>
                        </div>

                        <p style="font-weight: 700; font-size: 13px; color: #475569; margin: 20px 0 8px;">Escolha Frente ou Costas:</p>
                        <div class="q-prod-picker" id="q-prod-picker"></div>
                        <p style="font-size: 11px; color: #92400e; background: #fef3c7; border: 1px solid #fde68a; border-radius: 10px; padding: 8px 12px; margin: 8px 0 16px; text-align: center; line-height: 1.5;">⚠️ Se você escolheu a foto de costas, envie uma foto sua também de costas, se escolheu a frente, envie de frente.</p>

                        <p style="font-weight: 700; font-size: 14px; color: #475569; margin: 20px 0 10px;">Sua foto deve seguir os requisitos:</p>
                        <div class="q-tips-grid">
                            <div class="q-tip-item"><i class="ph-bold ph-t-shirt"></i> Com roupa</div>
                            <div class="q-tip-item"><i class="ph-bold ph-hand-pointing"></i> Braços soltos</div>
                            <div class="q-tip-item"><i class="ph-bold ph-sun"></i> Boa luz</div>
                        </div>

                        <div style="display: flex; gap: 12px; justify-content: center; margin: 20px 0;">
                            <div id="q-upload-area" style="width:100px; height:100px; border:2px dashed #e2e8f0; border-radius:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; background:#fff;">
                                <i class="ph-bold ph-camera-plus" style="font-size:24px; color:var(--q-quantic)"></i>
                                <input type="file" id="q-real-input" accept="image/*" style="display:none">
                            </div>
                            <div id="q-pre-view" style="display:none; width:100px; height:100px; border-radius:20px; overflow:hidden; border:1px solid #f1f5f9;">
                                <img id="q-pre-img" style="width:100%; height:100%; object-fit:cover;">
                            </div>
                        </div>
                        <label style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;cursor:pointer;font-size:11px;line-height:1.4;color:#64748b;">
                            <input type="checkbox" id="q-accept-terms" style="cursor:pointer;accent-color:#000;">
                            Ao continuar, concordo com os <a href="http://provoulevou.com.br/termos.html" target="_blank" style="color:#8b5cf6;text-decoration:underline;">Termos e Condi\u00e7\u00f5es</a>
                        </label>
                        <button class="q-btn-black" id="q-btn-generate" disabled>MATERIALIZAR LOOK</button>
                    </div>
                </div>

                <div class="q-loader-ui" id="q-loading-box">
                    <div style="font-weight:800; font-size:18px;">CONECTANDO IA CALMÔ...</div>
                    <p style="font-size:13px; color:#64748b; margin-top:10px;">Isso pode levar até 40 segundos.</p>
                    <div style="height:4px; background:#f1f5f9; border-radius:10px; overflow:hidden; margin-top:15px;"><div style="width:100%; height:100%; background:#000; animation: q-slide 1.5s infinite linear;"></div></div>
                </div>

                <div id="q-step-result" style="display:none; flex-direction:column; align-items:center;">
                    <div style="width:100%; border-radius:24px; overflow:hidden; border:1px solid #f1f5f9; margin-bottom:20px;">
                        <img id="q-final-view-img" style="width:100%; height:auto; display:block;">
                    </div>
                    <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:15px; border-radius:18px; width:100%; margin-bottom:15px;">
                        <span style="font-size:10px; font-weight:800; color:#166534; letter-spacing:1px;">TAMANHO IDEAL PARA VOCÊ:</span>
                        <div id="q-res-letter" style="font-size:32px; font-weight:900; color:#15803d; line-height:1;">M</div>
                    </div>
                    <button class="q-btn-buy" id="q-add-to-cart-btn">🛒 COMPRAR TAMANHO <span id="q-btn-size-text">M</span></button>
                    <button class="q-btn-outline" id="q-return-product">VOLTAR AO PRODUTO</button>
                </div>
            </div>

            <a href="https://provoulevou.com.br" target="_blank" class="q-powered-footer" style="text-decoration:none;">
                <span style="font-size:11px; color:#94a3b8;">powered by</span>
                <img src="https://provoulevou.com.br/assets/provoulevou-logo.png" class="q-quantic-logo">
            </a>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // 4. Iniciar Funcionalidade (Injetar botão na foto e rodar lógica)
    function initProvadorTools() {
        console.log("🔥 [Provador IA] Função initProvadorTools disparada!");
        const wrapper = document.getElementById('q-product-wrapper');

        // Injetar Botão na Foto
        if (wrapper && !document.getElementById('q-open-ia')) {
            const btnHtml = `
                <button type="button" id="q-open-ia" class="q-btn-trigger-ia q-animate-attention">
                    <i class="ph-fill ph-magic-wand"></i>
                    <span>Provar em Mim ✨</span>
                </button>
            `;
            wrapper.insertAdjacentHTML('beforeend', btnHtml);
        }

        const WEBHOOK_PROVA = 'https://n8n.segredosdodrop.com/webhook/quantic-materialize';
        const WEBHOOK_CARRINHO = 'https://n8n.segredosdodrop.com/webhook/adicionou-carrinho-calmo';

        const OPEN_BTN = document.getElementById('q-open-ia');
        const GEN_BTN = document.getElementById('q-btn-generate');
        const BUY_BTN = document.getElementById('q-add-to-cart-btn');
        let userPhoto = null;
        let recommendedSize = "M";
        let selectedProductImgUrl = null;

        function populateProductPicker() {
            const picker = document.getElementById('q-prod-picker');
            if (!picker) return;
            picker.innerHTML = '';
            const thumbs = document.querySelectorAll('.js-product-thumb');
            const max = Math.min(thumbs.length, 3);
            for (let i = 0; i < max; i++) {
                const anchor = thumbs[i];
                const img = anchor.querySelector('img');
                if (!img) continue;

                const srcset = img.getAttribute('srcset') || img.dataset.srcset || '';
                let src = '';
                if (srcset) {
                    const entries = srcset.split(',').map(s => s.trim()).filter(Boolean);
                    const url640 = entries[entries.length - 1].split(/\s+/)[0];
                    src = url640.replace(/-\d+-\d+\.webp$/, '-1024-1024.webp');
                }
                if (!src) {
                    src = window.LS?.variants?.[i]?.image_url
                        || window.LS?.variants?.[0]?.image_url
                        || document.querySelector('meta[property="og:image"]')?.content
                        || '';
                }
                const thumbSrc = src.replace('-1024-1024.webp', '-640-0.webp') || src;

                const div = document.createElement('div');
                div.className = 'q-prod-thumb' + (i === 0 ? ' q-selected' : '');
                div.dataset.src = src;
                div.innerHTML = `<img src="${thumbSrc}" alt="Foto ${i + 1}">`;
                div.onclick = () => {
                    document.querySelectorAll('.q-prod-thumb').forEach(t => t.classList.remove('q-selected'));
                    div.classList.add('q-selected');
                    selectedProductImgUrl = src;
                };
                picker.appendChild(div);
                if (i === 0) selectedProductImgUrl = src;
            }
        }

        document.getElementById('q-modal-close-btn').onclick = () => document.getElementById('q-modal-ia').style.display = 'none';
        document.getElementById('q-return-product').onclick = () => location.reload();
        document.getElementById('q-upload-area').onclick = () => document.getElementById('q-real-input').click();

        function checkLimit() {
            const today = new Date().toLocaleDateString();
            let usage = { count: 0, date: today };
            try {
                const stored = localStorage.getItem('calmo_v1_limit');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.date === today) usage = parsed;
                }
            } catch (e) { }

            const isOver = usage.count >= 2;
            document.getElementById('q-limit-alert').style.display = isOver ? 'block' : 'none';
            document.getElementById('q-form-container').style.display = isOver ? 'none' : 'block';
            return isOver;
        }

        function incrementLimit() {
            const today = new Date().toLocaleDateString();
            let usage = { count: 0, date: today };
            try {
                const stored = localStorage.getItem('calmo_v1_limit');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.date === today) usage = parsed;
                }
                usage.count += 1;
                localStorage.setItem('calmo_v1_limit', JSON.stringify(usage));
            } catch (e) { }
        }

        if (OPEN_BTN) {
            OPEN_BTN.onclick = () => {
                checkLimit();
                populateProductPicker();
                document.getElementById('q-modal-ia').style.display = 'flex';
                document.getElementById('q-block-alert').style.display = 'none';
            };
        }

        const phoneInput = document.getElementById('q-phone');
        phoneInput.oninput = (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            validateForm();
        };

        function validateForm() {
            const phone = phoneInput.value.replace(/\D/g, '');
            const isPhoneValid = phone.length >= 10;
            const h = document.getElementById('q-h-val').value;
            const w = document.getElementById('q-w-val').value;

            document.getElementById('q-phone-error').style.display = (phone.length > 0 && !isPhoneValid) ? 'block' : 'none';

            const over = checkLimit();
            GEN_BTN.disabled = !(isPhoneValid && h && w && userPhoto && !over && document.getElementById('q-accept-terms').checked);
        }

        ['q-h-val', 'q-w-val'].forEach(id => document.getElementById(id).oninput = validateForm);
        document.getElementById('q-accept-terms').onchange = validateForm;

        document.getElementById('q-real-input').onchange = (e) => {
            userPhoto = e.target.files[0];
            if (userPhoto) {
                const rd = new FileReader();
                rd.onload = (ev) => {
                    document.getElementById('q-pre-img').src = ev.target.result;
                    document.getElementById('q-pre-view').style.display = 'block';
                    validateForm();
                };
                rd.readAsDataURL(userPhoto);
            }
        };

        GEN_BTN.onclick = async () => {
            if (checkLimit()) return;

            // 🚨 VALIDAÇÃO BÁSICA NO FRONT 🚨
            const apiKey = window.PROVOU_LEVOU_API_KEY;
            if (!apiKey) {
                document.getElementById('q-block-alert').innerText = "Erro: API Key não detectada. Instalação incorreta ou desatualizada na sua Tag.";
                document.getElementById('q-block-alert').style.display = 'block';
                return;
            }

            const h = document.getElementById('q-h-val').value;
            const w = document.getElementById('q-w-val').value;
            const prodImg = selectedProductImgUrl || document.querySelector('meta[property="og:image"]')?.content || document.querySelector('.js-product-image img')?.src;

            document.getElementById('q-step-upload').style.display = 'none';
            document.getElementById('q-block-alert').style.display = 'none';
            document.getElementById('q-loading-box').style.display = 'block';

            try {
                const phoneVal = phoneInput.value.replace(/\D/g, '');
                const fd = new FormData();
                fd.append('person_image', userPhoto);
                fd.append('whatsapp', '55' + phoneVal);
                fd.append('height', h);
                fd.append('weight', w);
                fd.append('product_name', document.title);

                // 👉 A MÁGICA: INJETA A CHAVE NO FORM DATA PRO N8N LER
                fd.append('api_key', apiKey);

                const prodBlob = await fetch(prodImg).then(r => r.blob());
                fd.append('product_image', prodBlob, 'p.png');

                const res = await fetch(WEBHOOK_PROVA, { method: 'POST', body: fd });

                if (res.ok) {
                    incrementLimit();
                    const blob = await res.blob();
                    document.getElementById('q-final-view-img').src = URL.createObjectURL(blob);
                    calculateFinalSize(h, w);
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-step-result').style.display = 'flex';
                } else if (res.status === 401 || res.status === 403) {
                    // Resposta do n8n bloqueando
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-step-upload').style.display = 'block';
                    document.getElementById('q-block-alert').innerText = "Provas virtuais indisponíveis nesta loja no momento. (Chave inválida)";
                    document.getElementById('q-block-alert').style.display = 'block';
                } else {
                    throw new Error();
                }
            } catch (e) {
                document.getElementById('q-loading-box').style.display = 'none';
                document.getElementById('q-step-upload').style.display = 'block';
                document.getElementById('q-block-alert').innerText = "Ocorreu um erro de comunicação ou servidor ocupado. Tente novamente.";
                document.getElementById('q-block-alert').style.display = 'block';
            }
        };

        // ===============================================
        // TABELAS DE MEDIDAS CALMÔ (Ref: modelo 186cm / 78kg = M / 40)
        // ===============================================
        // OVERSIZED:     P(75/54/24) M(76/57/28) G(78/59/30) GG(79/64/32)
        // SLIM:          P(72/45/21) M(74/47/22) G(77/49/23) GG(79/51/24)
        // JEANS BALÃO:   38(103/38/21) 40(104/40/22) 42(105/42/23) 44(106/44/23) 46(107/46/24) 48(108/48/25)
        // CARGO JEANS:   P(103/38/24) M(104/40/25) G(105/42/26) GG(106/44/27)
        // CALÇA:         P(98/35.5) M(99/37) G(101/41) GG(102/44)
        // ===============================================
        function calculateFinalSize(h, w) {
            let hInt = parseFloat(h.toString().replace(',', '.'));
            let wInt = parseFloat(w.toString().replace(',', '.'));
            if (hInt < 3) hInt = hInt * 100;
            const name = document.title.toLowerCase();
            let size = "M";

            // Score combinado: peso (70%) + altura (10%) — calibrado para 186cm/78kg = 73.2
            const score = (wInt * 0.7) + (hInt * 0.1);

            if (name.includes("oversized")) {
                // Fit generoso — thresholds mais altos
                if (score <= 67) size = "P";
                else if (score <= 78) size = "M";
                else if (score <= 88) size = "G";
                else size = "GG";
            } else if (name.includes("slim")) {
                // Fit justo — thresholds mais baixos
                if (score <= 64) size = "P";
                else if (score <= 75) size = "M";
                else if (score <= 85) size = "G";
                else size = "GG";
            } else if (name.includes("balão") || name.includes("balao")) {
                // Jeans Balão — tamanhos numéricos 38-48
                if (score <= 66) size = "38";
                else if (score <= 74) size = "40";
                else if (score <= 82) size = "42";
                else if (score <= 89) size = "44";
                else if (score <= 96) size = "46";
                else size = "48";
            } else if (name.includes("cargo")) {
                // Cargo Jeans — cintura 38/40/42/44
                if (score <= 67) size = "P";
                else if (score <= 77) size = "M";
                else if (score <= 87) size = "G";
                else size = "GG";
            } else if (name.includes("calça") || name.includes("calca") || name.includes("jogger") || name.includes("moletom")) {
                // Calça genérica — cintura 35.5/37/41/44
                if (score <= 65) size = "P";
                else if (score <= 76) size = "M";
                else if (score <= 86) size = "G";
                else size = "GG";
            } else {
                // Default: lógica oversized (produto mais comum)
                if (score <= 67) size = "P";
                else if (score <= 78) size = "M";
                else if (score <= 88) size = "G";
                else size = "GG";
            }

            recommendedSize = size;
            document.getElementById('q-res-letter').innerText = size;
            document.getElementById('q-btn-size-text').innerText = size;
        }

        BUY_BTN.onclick = function () {
            const phoneVal = phoneInput.value.replace(/\D/g, '');
            fetch(WEBHOOK_CARRINHO, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    whatsapp: '55' + phoneVal,
                    product: document.title,
                    recommended_size: recommendedSize
                })
            });
            this.innerText = "ADICIONANDO...";
            const variantSelects = document.querySelectorAll('.js-variant-select, .js-product-variants select');
            variantSelects.forEach(select => {
                for (let option of select.options) {
                    if (option.text.trim().toUpperCase() === recommendedSize.toUpperCase()) {
                        select.value = option.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            });
            const nativeBuyBtn = document.querySelector('.js-addtocart, .js-product-buy-btn, [name="add"]');
            if (nativeBuyBtn) nativeBuyBtn.click();
            setTimeout(() => location.reload(), 800);
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProvadorTools);
    } else {
        initProvadorTools();
    }
})();

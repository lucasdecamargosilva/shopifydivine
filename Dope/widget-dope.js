(function () {
    const WEBHOOK_PROVA = 'https://n8n.segredosdodrop.com/webhook/quantic-materialize';
    const API_KEY = 'pl_live_27c4eb2dd170722236b299720634953653d9f6cd24bd261fc0233245501980f3';

    const styles = `
        :root {
            --q-primary: #000000;
            --q-bg: #ffffff;
            --q-border: #000000;
            --q-gray: #f5f5f5;
            --q-text: #000000;
            --q-text-light: #666666;
            --q-accent: #D4A017;
        }
        .q-btn-trigger-ia {
            position: absolute; top: 15px; right: 15px; z-index: 100;
            background: #000000;
            color: var(--q-accent); border: 1px solid var(--q-accent);
            padding: 6px 18px; font-family: 'Inter', sans-serif;
            font-weight: 600; font-size: 9px; letter-spacing: 1.5px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; gap: 6px; text-transform: uppercase;
            transition: 0.3s ease;
            white-space: nowrap;
        }
        .q-btn-trigger-ia i { font-size: 14px; color: var(--q-accent); }
        .q-btn-trigger-ia:hover {
            background: var(--q-accent);
            color: #000000;
        }
        .q-btn-trigger-ia:hover i { color: #000000; }
        #q-modal-ia {
            display: none; position: fixed; inset: 0; background: rgba(255,255,255,0.98);
            z-index: 999999; align-items: center; justify-content: center; font-family: 'Inter', sans-serif;
        }
        .q-card-ia {
            background: var(--q-bg); width: 100%; max-width: 480px;
            padding: 0; position: relative; color: var(--q-text);
            border: 1px solid var(--q-border);
            max-height: 94vh; display: flex; flex-direction: column; overflow: hidden;
        }
        .q-content-scroll { padding: 40px 30px; overflow-y: auto; flex: 1; text-align: center; }
        .q-close-ia { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--q-text); cursor: pointer; font-size: 24px; z-index: 100; font-weight: 300; }
        .q-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 20px 0; margin: 20px 0; border-top: 1px solid var(--q-gray); border-bottom: 1px solid var(--q-gray); }
        .q-tip-item { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--q-text-light); }
        .q-tip-item i { color: var(--q-primary); font-size: 20px; }
        .q-lead-form { margin: 30px 0 20px; display: flex; flex-direction: column; gap: 20px; text-align: left; }
        .q-group { flex: 1; }
        .q-group label { display: block; font-size: 9px; font-weight: 600; letter-spacing: 1.5px; color: var(--q-text); margin-bottom: 8px; text-transform: uppercase; }
        .q-input { width: 100%; padding: 15px; border: 1px solid var(--q-border); font-size: 13px; font-family: 'Inter', sans-serif; background: transparent; color: var(--q-text); outline: none; box-sizing: border-box; }
        .q-input:focus { border-width: 2px; padding: 14px; }
        .q-btn-black { background: var(--q-primary); color: var(--q-bg); border: 1px solid var(--q-primary); width: 100%; padding: 18px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-top: 20px; transition: 0.3s; }
        .q-btn-black:disabled { background: var(--q-gray); color: #999; border-color: var(--q-gray); cursor: not-allowed; }
        .q-btn-black:not(:disabled):hover { background: var(--q-bg); color: var(--q-primary); }
        .q-btn-buy { background: var(--q-primary); color: var(--q-bg); border: 1px solid var(--q-primary); width: 100%; padding: 20px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; margin-bottom: 15px; transition: 0.3s; }
        .q-btn-buy:hover { background: var(--q-bg); color: var(--q-primary); }
        .q-btn-outline { background: var(--q-bg); color: var(--q-primary); border: 1px solid var(--q-border); width: 100%; padding: 18px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.3s; }
        .q-btn-outline:hover { background: var(--q-primary); color: var(--q-bg); }
        .q-powered-footer { background: var(--q-bg); padding: 20px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-shrink: 0; border-top: 1px solid var(--q-gray); }
        .q-quantic-logo { height: 24px; filter: brightness(0); }
        .q-loader-ui { display:none; padding: 60px 0; }
        .q-status-msg { display:none; font-size: 10px; letter-spacing: 1px; color: #ef4444; margin-top: 8px; font-weight: 600; text-align: left; text-transform: uppercase; }
        @keyframes q-slide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes q-pulse-text { 0%, 100% { opacity: 0.4; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } }
        .q-content-scroll::-webkit-scrollbar { width: 4px; }
        .q-content-scroll::-webkit-scrollbar-track { background: transparent; }
        .q-content-scroll::-webkit-scrollbar-thumb { background: #e5e5e5; }
    `;

    function createModalHTML() {
        const wrapper = document.createElement('div');
        wrapper.id = 'q-modal-ia';

        const card = document.createElement('div');
        card.className = 'q-card-ia';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'q-close-ia';
        closeBtn.id = 'q-close-btn';
        closeBtn.textContent = '\u00D7';
        card.appendChild(closeBtn);

        const contentScroll = document.createElement('div');
        contentScroll.className = 'q-content-scroll';

        // Header with logo
        const header = document.createElement('div');
        header.id = 'q-header-provador';
        const logo = document.createElement('img');
        logo.src = 'https://acdn-us.mitiendanube.com/stores/004/951/445/themes/common/logo-970428037-1768348654-f73a49ab7538c0e848494f65156679521768348654-640-0.webp';
        logo.alt = 'DOPE';
        logo.style.cssText = 'max-width: 120px; height: auto; margin: 0 auto 15px; display: block;';
        const h1 = document.createElement('h1');
        h1.style.cssText = 'margin:0 0 10px 0; font-size:20px; font-weight:700; letter-spacing:2px; text-transform:uppercase;';
        h1.textContent = 'Provador Virtual';
        header.appendChild(logo);
        header.appendChild(h1);
        contentScroll.appendChild(header);

        // Step upload
        const stepUpload = document.createElement('div');
        stepUpload.id = 'q-step-upload';

        // Lead form - only WhatsApp
        const leadForm = document.createElement('div');
        leadForm.className = 'q-lead-form';

        const phoneGroup = document.createElement('div');
        phoneGroup.className = 'q-group';
        const phoneLabel = document.createElement('label');
        phoneLabel.textContent = 'Seu WhatsApp';
        const phoneInput = document.createElement('input');
        phoneInput.type = 'tel';
        phoneInput.id = 'q-phone';
        phoneInput.className = 'q-input';
        phoneInput.placeholder = '(11) 99999-9999';
        phoneInput.maxLength = 15;
        const phoneError = document.createElement('div');
        phoneError.id = 'q-phone-error';
        phoneError.className = 'q-status-msg';
        phoneError.textContent = 'Insira um número válido';
        phoneGroup.appendChild(phoneLabel);
        phoneGroup.appendChild(phoneInput);
        phoneGroup.appendChild(phoneError);
        leadForm.appendChild(phoneGroup);

        stepUpload.appendChild(leadForm);

        // Tips
        const tipsText = document.createElement('p');
        tipsText.style.cssText = 'margin: 30px 0 10px; font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--q-text-light); text-align: center;';
        tipsText.textContent = 'Sua foto deve seguir estes requisitos:';
        stepUpload.appendChild(tipsText);

        const tipsGrid = document.createElement('div');
        tipsGrid.className = 'q-tips-grid';
        tipsGrid.style.marginTop = '0';
        [
            { icon: 'ph ph-t-shirt', text: 'Com Roupa' },
            { icon: 'ph ph-person', text: 'Corpo Inteiro' },
            { icon: 'ph ph-sun', text: 'Boa Luz' }
        ].forEach(function(tip) {
            const item = document.createElement('div');
            item.className = 'q-tip-item';
            const icon = document.createElement('i');
            icon.className = tip.icon;
            const span = document.createElement('span');
            span.textContent = tip.text;
            item.appendChild(icon);
            item.appendChild(span);
            tipsGrid.appendChild(item);
        });
        stepUpload.appendChild(tipsGrid);

        // Upload area
        const uploadArea = document.createElement('div');
        uploadArea.style.cssText = 'display: flex; gap: 20px; justify-content: center; margin-top: 30px;';

        const triggerUpload = document.createElement('div');
        triggerUpload.id = 'q-trigger-upload';
        triggerUpload.style.cssText = 'width:120px; height:160px; border:1px solid var(--q-border); display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:var(--q-gray); transition:0.3s;';
        const camIcon = document.createElement('i');
        camIcon.className = 'ph ph-camera-plus';
        camIcon.style.cssText = 'font-size:32px; color:var(--q-primary); margin-bottom: 10px;';
        const uploadSpan = document.createElement('span');
        uploadSpan.style.cssText = 'font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;';
        uploadSpan.textContent = 'Enviar Foto';
        const realInput = document.createElement('input');
        realInput.type = 'file';
        realInput.id = 'q-real-input';
        realInput.accept = 'image/*';
        realInput.style.display = 'none';
        triggerUpload.appendChild(camIcon);
        triggerUpload.appendChild(uploadSpan);
        triggerUpload.appendChild(realInput);

        const preView = document.createElement('div');
        preView.id = 'q-pre-view';
        preView.style.cssText = 'display:none; width:120px; height:160px; overflow:hidden; border:1px solid var(--q-border);';
        const preImg = document.createElement('img');
        preImg.id = 'q-pre-img';
        preImg.style.cssText = 'width:100%; height:100%; object-fit:cover;';
        preView.appendChild(preImg);

        uploadArea.appendChild(triggerUpload);
        uploadArea.appendChild(preView);
        stepUpload.appendChild(uploadArea);

        const genBtn = document.createElement('button');
        genBtn.className = 'q-btn-black';
        genBtn.id = 'q-btn-generate';
        genBtn.disabled = true;
        genBtn.textContent = 'Ver no meu corpo';
        var termsLabel = document.createElement('label');
        termsLabel.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;cursor:pointer;font-size:11px;line-height:1.4;color:#64748b;';
        var termsCheckbox = document.createElement('input');
        termsCheckbox.type = 'checkbox';
        termsCheckbox.id = 'q-accept-terms';
        termsCheckbox.style.cssText = 'cursor:pointer;accent-color:#000;';
        termsLabel.appendChild(termsCheckbox);
        var termsText = document.createElement('span');
        termsText.textContent = 'Ao continuar, concordo com os ';
        var termsLink = document.createElement('a');
        termsLink.href = 'http://provoulevou.com.br/termos.html';
        termsLink.target = '_blank';
        termsLink.style.cssText = 'color:#8b5cf6;text-decoration:underline;';
        termsLink.textContent = 'Termos e Condi\u00e7\u00f5es';
        termsText.appendChild(termsLink);
        termsLabel.appendChild(termsText);
        stepUpload.appendChild(termsLabel);

        stepUpload.appendChild(genBtn);

        contentScroll.appendChild(stepUpload);

        // Loading
        const loadingBox = document.createElement('div');
        loadingBox.className = 'q-loader-ui';
        loadingBox.id = 'q-loading-box';
        const loadingText = document.createElement('div');
        loadingText.style.cssText = 'font-weight:600; font-size:12px; letter-spacing:3px; text-transform:uppercase; margin-bottom:20px; animation: q-pulse-text 1.5s infinite ease-in-out;';
        loadingText.textContent = 'Processando Imagem...';
        const loadingBar = document.createElement('div');
        loadingBar.style.cssText = 'height:1px; background:var(--q-gray); width:100%; position:relative; overflow:hidden;';
        const loadingBarInner = document.createElement('div');
        loadingBarInner.style.cssText = 'position:absolute; top:0; left:0; height:100%; width:30%; background:var(--q-primary); animation: q-slide 1.5s infinite linear;';
        loadingBar.appendChild(loadingBarInner);
        loadingBox.appendChild(loadingText);
        loadingBox.appendChild(loadingBar);
        contentScroll.appendChild(loadingBox);

        // Result
        const stepResult = document.createElement('div');
        stepResult.id = 'q-step-result';
        stepResult.style.cssText = 'display:none; flex-direction:column; align-items:center;';

        const resultImgWrap = document.createElement('div');
        resultImgWrap.style.cssText = 'width:100%; border:1px solid var(--q-border); margin-bottom:30px; background:var(--q-gray);';
        const finalImg = document.createElement('img');
        finalImg.id = 'q-final-view-img';
        finalImg.style.cssText = 'width:100%; height:auto; display:block;';
        resultImgWrap.appendChild(finalImg);
        stepResult.appendChild(resultImgWrap);

        const backBtn = document.createElement('button');
        backBtn.className = 'q-btn-black';
        backBtn.id = 'q-btn-back';
        backBtn.textContent = 'Voltar ao Produto';
        stepResult.appendChild(backBtn);

        const retryBtn = document.createElement('p');
        retryBtn.id = 'q-retry-btn';
        retryBtn.style.cssText = 'margin-top:30px; font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:var(--q-text-light); cursor:pointer; text-decoration:underline; text-underline-offset:4px;';
        retryBtn.textContent = 'Tentar outra foto';
        stepResult.appendChild(retryBtn);

        contentScroll.appendChild(stepResult);
        card.appendChild(contentScroll);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'q-powered-footer';
        const footerText = document.createElement('span');
        footerText.style.cssText = 'font-size:9px; letter-spacing:1px; text-transform:uppercase; color:var(--q-text-light);';
        footerText.textContent = 'Powered by';
        const footerLink = document.createElement('a');
        footerLink.href = 'https://provoulevou.com.br';
        footerLink.target = '_blank';
        footerLink.rel = 'noopener noreferrer';
        const footerLogo = document.createElement('img');
        footerLogo.src = 'https://i.ibb.co/Jj0sWpky/logo-provou-levou-sem-fundo.png';
        footerLogo.className = 'q-quantic-logo';
        footerLink.appendChild(footerLogo);
        footer.appendChild(footerText);
        footer.appendChild(footerLink);
        card.appendChild(footer);

        wrapper.appendChild(card);
        return wrapper;
    }

    function getProductImageUrl() {
        var selectors = [
            '.js-product-slide-img',
            '.product-slider-image',
            '.js-product-slide-link img',
            '.product-image-container img',
            '[data-store^="product-image"] img',
            'img[srcset]'
        ];
        for (var i = 0; i < selectors.length; i++) {
            var tag = document.querySelector(selectors[i]);
            if (tag) {
                var url = tag.currentSrc || tag.src || tag.dataset.src || '';
                if (url && url.indexOf('data:') !== 0) return url;
                // try srcset
                var srcset = tag.getAttribute('srcset') || tag.dataset.srcset || '';
                if (srcset) {
                    var first = srcset.split(',')[0].trim().split(' ')[0];
                    if (first && first.indexOf('data:') !== 0) return first;
                }
            }
        }
        var og = document.querySelector('meta[property="og:image"]');
        return og ? og.content : '';
    }

    function init() {
        // Only show for allowed categories: camisetas, polos, jorts/shorts
        var breadcrumb = document.querySelector('.breadcrumbs, .breadcrumb, nav[aria-label="breadcrumb"]');
        var breadcrumbText = breadcrumb ? breadcrumb.textContent.toLowerCase() : '';
        var pageTitle = (document.querySelector('h1') || {}).textContent || '';
        var checkText = breadcrumbText + ' ' + pageTitle.toLowerCase();
        var allowedCategories = ['camiseta', 'polo', 'jort', 'short'];
        var isAllowed = allowedCategories.some(function(cat) { return checkText.indexOf(cat) !== -1; });
        if (!isAllowed) return;

        if (!document.getElementById('q-inter-font')) {
            var fontLink = document.createElement('link');
            fontLink.id = 'q-inter-font';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
        }
        if (!window.phosphorIconsLoaded) {
            var phosphorScript = document.createElement('script');
            phosphorScript.src = 'https://unpkg.com/@phosphor-icons/web';
            document.head.appendChild(phosphorScript);
            window.phosphorIconsLoaded = true;
        }

        var styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);

        var modalEl = createModalHTML();
        document.body.appendChild(modalEl);

        var modal = document.getElementById('q-modal-ia');
        var openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.className = 'q-btn-trigger-ia';
        openBtn.id = 'q-open-ia';
        var userIcon = document.createElement('i');
        userIcon.className = 'ph ph-user';
        var btnText = document.createElement('span');
        btnText.textContent = 'Provador Virtual';
        openBtn.appendChild(userIcon);
        openBtn.appendChild(btnText);

        // Nuvemshop selectors - target the first slide specifically
        var imgContainers = [
            '.js-product-slide:first-child',
            '.js-swiper-product .swiper-slide:first-child',
            '.product-image-container .swiper-slide:first-child',
            '.product-image-container',
            '.js-swiper-product',
            '.product-image-column',
            '[data-store^="product-image"]',
            '#single-product .col-md-auto:first-child'
        ];

        var foundContainer = false;
        for (var i = 0; i < imgContainers.length; i++) {
            var container = document.querySelector(imgContainers[i]);
            if (container) {
                if (window.getComputedStyle(container).position === 'static') {
                    container.style.position = 'relative';
                }
                container.appendChild(openBtn);
                openBtn.style.position = 'absolute';
                openBtn.style.top = '15px';
                openBtn.style.right = '15px';
                openBtn.style.left = 'auto';
                openBtn.style.transform = 'none';
                openBtn.style.margin = '0';
                openBtn.style.bottom = 'auto';
                foundContainer = true;
                break;
            }
        }

        if (!foundContainer) {
            openBtn.style.position = 'fixed';
            openBtn.style.bottom = '30px';
            openBtn.style.left = '50%';
            openBtn.style.transform = 'translateX(-50%)';
            openBtn.style.top = 'auto';
            openBtn.style.right = 'auto';
            document.body.appendChild(openBtn);
        }

        // Second button between color and size variants
        var openBtn2 = document.createElement('button');
        openBtn2.type = 'button';
        openBtn2.className = 'q-btn-trigger-ia';
        openBtn2.id = 'q-open-ia-2';
        openBtn2.style.cssText = 'position:relative; top:auto; right:auto; width:auto; margin:8px 0 8px 12px; padding:6px 16px; font-size:9px; display:flex; border:1px solid var(--q-accent);';
        var userIcon2 = document.createElement('i');
        userIcon2.className = 'ph ph-user';
        var btnText2 = document.createElement('span');
        btnText2.textContent = 'Provador Virtual';
        openBtn2.appendChild(userIcon2);
        openBtn2.appendChild(btnText2);

        // Find size variant group (the one after the color group)
        var variantGroups = document.querySelectorAll('.js-product-variants .js-product-variants-group');
        var sizeGroup = null;
        for (var j = 0; j < variantGroups.length; j++) {
            if (!variantGroups[j].classList.contains('js-color-variants-container')) {
                sizeGroup = variantGroups[j];
                break;
            }
        }
        if (sizeGroup) {
            sizeGroup.parentNode.insertBefore(openBtn2, sizeGroup);
        }

        var genBtn = document.getElementById('q-btn-generate');
        var closeBtn = document.getElementById('q-close-btn');
        var backBtn = document.getElementById('q-btn-back');
        var retryBtn = document.getElementById('q-retry-btn');
        var realInput = document.getElementById('q-real-input');
        var triggerUpload = document.getElementById('q-trigger-upload');
        var phoneInput = document.getElementById('q-phone');

        var userPhoto = null;

        function openModal(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            genBtn.style.display = 'block';
            modal.style.display = 'flex';
        }
        openBtn.onclick = openModal;
        openBtn2.onclick = openModal;

        closeBtn.onclick = function() { modal.style.display = 'none'; };
        backBtn.onclick = function() { modal.style.display = 'none'; };
        retryBtn.onclick = function() {
            document.getElementById('q-step-result').style.display = 'none';
            document.getElementById('q-step-upload').style.display = 'block';
            userPhoto = null;
            document.getElementById('q-pre-view').style.display = 'none';
            checkFields();
        };
        triggerUpload.onclick = function() { realInput.click(); };

        phoneInput.addEventListener('input', function (e) {
            var x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            checkFields();
        });

        document.getElementById('q-accept-terms').onchange = checkFields;

        function checkFields() {
            var phoneNumbers = phoneInput.value.replace(/\D/g, '');
            var isPhoneValid = phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
            var phoneError = document.getElementById('q-phone-error');

            if (phoneInput.value.length > 0 && !isPhoneValid) {
                phoneError.style.display = 'block';
                phoneInput.style.borderColor = '#ef4444';
            } else {
                phoneError.style.display = 'none';
                phoneInput.style.borderColor = 'var(--q-border)';
            }

            var allFilled = userPhoto && isPhoneValid;
            genBtn.disabled = !(allFilled && document.getElementById('q-accept-terms').checked);
        }

        realInput.onchange = function(e) {
            userPhoto = e.target.files[0];
            if (userPhoto) {
                var rd = new FileReader();
                rd.onload = function(ev) {
                    document.getElementById('q-pre-img').src = ev.target.result;
                    document.getElementById('q-pre-view').style.display = 'block';
                    checkFields();
                };
                rd.readAsDataURL(userPhoto);
            }
        };

        genBtn.onclick = function() {
            var prodImgUrl = getProductImageUrl();
            var prodName = (document.querySelector('h1') || {}).innerText || document.title;
            var phoneVal = phoneInput.value.replace(/\D/g, '');

            document.getElementById('q-step-upload').style.display = 'none';
            document.getElementById('q-loading-box').style.display = 'block';

            // Fetch product image as blob, then send everything via FormData
            fetch(prodImgUrl)
                .then(function(r) { return r.blob(); })
                .then(function(prodBlob) {
                    var fd = new FormData();
                    fd.append('api_key', API_KEY);
                    fd.append('person_image', userPhoto);
                    fd.append('product_image', prodBlob, 'product.png');
                    fd.append('whatsapp', '55' + phoneVal);
                    fd.append('phone_raw', phoneInput.value);
                    fd.append('product_name', prodName);
                    fd.append('origin', window.location.origin);

                    return fetch(WEBHOOK_PROVA, { method: 'POST', body: fd });
                })
                .then(function(res) {
                    if (!res.ok) {
                        return res.text().then(function(t) { throw new Error('Status ' + res.status + ': ' + t); });
                    }
                    return res.blob();
                })
                .then(function(blob) {
                    if (!blob || blob.size === 0) {
                        throw new Error('Imagem vazia retornada pelo servidor');
                    }
                    var url = URL.createObjectURL(blob);
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-final-view-img').src = url;
                    document.getElementById('q-step-result').style.display = 'flex';
                })
                .catch(function(e) {
                    console.error('Provador error:', e);
                    alert('Erro no provador virtual: ' + e.message);
                    document.getElementById('q-loading-box').style.display = 'none';
                    document.getElementById('q-step-upload').style.display = 'block';
                });
        };

    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();

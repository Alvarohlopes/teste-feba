(function ($) {

    let listRealEstate = [];
    let filters = {
        stageSelect: '',
        localSelect: '',
        typeSelect: ''
    };
    let limitList = 9;

    function fluidScroll() {
        $('a[href^="#"]').on('click', function (e) {
            e.preventDefault();
            $('.navbar-collapse').removeClass('show');
            $('.navbar-toggler').addClass('collapsed');
            let id = $(this).attr('href');
            targetOffset = $(id).offset()?.top - 140;
            $('html, body').animate({
                scrollTop: targetOffset
            }, 500);
        });
    }

    function animateByScroll() {
        $(window).scroll(function () {
            $.each($('.show-on-scroll'), function () {
                var positionScroll = $(window).scrollTop();

                if (positionScroll > $('#' + this.id).offset().top - 870) {
                    $('#' + this.id + ' .show-left').addClass('slide-in-left');
                    $('#' + this.id + ' .show-right').addClass('slide-in-right');
                    $('#' + this.id + ' .show-bottom').addClass('slide-in-bottom');
                    $('#' + this.id + ' .show-center').addClass('scale-in-center');
                }

            });
        });
    }

    function openWhatsapp() {
        $('.open-whatsapp').on('click', function () {
            window.open('//api.whatsapp.com/send?phone=119909-9091&text=Esse é um contato do site Liva');
        })
    }

    function getSlickOptions() {
        $('.slide-pre-release').slick({
            infinite: true,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            autoplay: true,
            autoplaySpeed: 2000,
            prevArrow: $('.prev'),
            nextArrow: $('.next'),
        });
    }

    function knowMore() {
        $('.know-more').on('click', function () {
            window.location.assign('#realEstateInner');
        })
    }

    function validateAndSendForm() {
        const contactForm = document.querySelectorAll('#contactForm');

        contactForm.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (form.checkValidity()) {
                    $('#submitForm').text('ENVIANDO MENSAGEM')
                    sendFormFake(this)
                }

                form.classList.add('was-validated')
            }, false)
        })
    }

    function sendFormFake(form) {
        const formValue = $(form).serializeArray();
        console.log(formValue);

        setTimeout(() => {
            $('.contact-form').hide();
            $('.success-message').removeClass('d-none');

            setTimeout(() => {
                $(form)[0].reset();
                $('#submitForm').text('ENVIAR MENSAGEM')

                $('.contact-form').show();
                $('.success-message').addClass('d-none')
            }, 2000);
        }, 1000);
    }

    function formtPhone() {
        $("#phoneForm")
            .mask("(99) 9999-9999?9")
            .focusout(function (event) {
                var target, phone, element;
                target = (event.currentTarget) ? event.currentTarget : event.srcElement;
                phone = target.value.replace(/\D/g, '');
                element = $(target);
                element.unmask();
                if (phone.length > 10) {
                    element.mask("(99) 99999-999?9");
                } else {
                    element.mask("(99) 9999-9999?9");
                }
            });
    }

    function isMobile() {
        if ($(window).width() < 760) {
            limitList = 4;
        }
    }

    function getRealEstateJson() {
        $.ajax({
            url: './../../json/empreendimentos.json',
            dataType: 'json'
        }).done(function (realEstate) {
            listRealEstate = realEstate;
            getSelectOptions(realEstate);
            getRealEstateList(realEstate);
            showLoadMoreButtom(realEstate);
        });

        // $.get('./../../json/empreendimentos.json', function (realEstate) {

        // });
    }

    function getSelectOptions(realEstate) {
        const stageList = [];
        const localList = []
        const typeList = []

        $.each(realEstate, function (index, realEstate) {
            const stageIndex = stageList.findIndex((stage) => stage === realEstate.stage);

            if (stageIndex === -1) {
                stageList.push(realEstate.stage);
            }
            const localIndex = localList.findIndex((local) => local === `${realEstate.neighborhood} - ${realEstate.city}`);
            if (localIndex === -1) {
                localList.push(`${realEstate.neighborhood} - ${realEstate.city}`);
            }
            const typeIndex = typeList.findIndex((type) => type === realEstate.type);
            if (typeIndex === -1) {
                typeList.push(realEstate.type);
            }
        });

        optionGenerate(stageList, '#stageSelect');
        optionGenerate(localList, '#localSelect');
        optionGenerate(typeList, '#typeSelect');
    }

    function optionGenerate(list, id) {
        $.each(list, function (i, item) {
            $(id).append($('<option>', {
                value: item,
                text: item
            }));
        });
    }

    function getRealEstateList(RealEstate) {
        $('.grid-gallery').html('<div class="loading">Carregando empreendimentos...</div>');

        let newRealEstate = [];

        if (RealEstate?.length > 0) {

            $.each(RealEstate, function (index, item) {

                if (
                    (filters.localSelect ? filters.localSelect === `${item.neighborhood} - ${item.city}` : !null) &&
                    (filters.stageSelect ? filters.stageSelect === item.stage : !null) &&
                    (filters.typeSelect ? filters.typeSelect === item.type : !null)
                ) {
                    newRealEstate.push(item);
                }
            })
        }


        if (newRealEstate?.length > 0) {

            setTimeout(() => {
                $('.grid-gallery').html('');
                $('.empty-grid-gallery').hide();

                $.each(newRealEstate, function (index, item) {
                    if (
                        (index + 1 <= limitList)
                    ) {
                        const image = getImageName(item.title);
                        $('.grid-gallery').append(`
                            <div class="item-real-estate scale-in-center real-estate-event-${item.id}"
                                style="background-image: url('./images/gallery/${image}.webp')">
                                <div class="details-item">
                                    <div class="type-item">${item.type}</div>
                                    <div class="name-item">${item.title}</div>
                                    <div class="local-item">
                                        <div class="city-item">Cidade<br><span>${item.city}</span></div>
                                        <div class="neighborhood-item">Bairro<br><span>${item.neighborhood}</span></div>
                                    </div>
                                    <div class="descripition-item">
                                        <img src="./images/icons/bedroom.svg" alt="Icone Sofa"> 
                                        ${item.description}
                                    </div>
                                    <div class="more-item more-${item.id}"></div>
                                </div>
                            </div>
                        `);

                        $.each(item.more, function (i, subitem) {
                            $(`.more-${item.id}`).append(`
                            <div class="descripition-item">
                                <img src="${subitem.icon}" alt="Icone"> 
                                ${subitem.text}
                            </div>
                            `);
                        })
                    }

                    showSelectedRealEstate(`.real-estate-event-${item.id}`)
                });

                showLoadMoreButtom(newRealEstate);
            }, 1000);

        } else {
            $('.empty-grid-gallery').show();
            $('.grid-gallery').html('');
        }

    }

    function showSelectedRealEstate(id) {
        $(id).on('click', function (e) {
            window.location.assign('#realEstate');
            $(`.${e.target.classList[2]}`).remove();
            $('.grid-gallery').prepend(e.target.outerHTML);
            showSelectedRealEstate(id);
        })
    }

    function getFiltersEvent() {
        $('.selectFilter').change(function (event) {
            filters[event.target.id] = event.target.value
            getRealEstateList(listRealEstate);
        });

    }

    function showAndHideFilters() {
        $('.filter-btn').on('click', function () {
            $('.filters-row').toggleClass('d-none');
            $('.icon-close').toggleClass('d-none');
            $('.icon-filter').toggleClass('d-none');
            $(this).toggleClass('active');
        })
    }

    function loadMoreRealEstate() {

        $('.load-more').on('click', function () {
            if (limitList < listRealEstate.length) {
                limitList += 4;

                getRealEstateList(listRealEstate);
                showLoadMoreButtom(listRealEstate);
            }
        })

    }

    function showLoadMoreButtom(list) {
        if (limitList >= list.length) {
            $('.load-more').hide();
        } else {
            $('.load-more').show();
        }
    }

    function getImageName(name) {
        return name.replace(/[^a-zA-Z\s]/g, "").toLowerCase().replaceAll(' ', '-');
    }

    fluidScroll();
    animateByScroll();
    knowMore();
    getSlickOptions();
    openWhatsapp();
    validateAndSendForm();
    formtPhone();
    isMobile();
    getRealEstateJson();
    showAndHideFilters();
    getFiltersEvent();
    loadMoreRealEstate();

}(jQuery));
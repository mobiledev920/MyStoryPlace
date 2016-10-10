function getTrimYap(pAlan) {
    if (pAlan.val().length > 0)
        pAlan.val(pAlan.val().trim());

    return pAlan;
}

function Ceny_MailKontrol(emailText) {
    email = $(emailText).val();

    var kontrol = new RegExp(/^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/i);
    return kontrol.test(email);
}

function Ceny_TextAlanKontrol(pAlan) {
    if (getTrimYap(pAlan).val().length == 0)
        return false;

    return true;
}


function Ceny_ComboAlanKontrol(pAlan) {
    var pDeger = $(pAlan).val();
    if (pDeger == null || pDeger == "-1" || pDeger == "") {
        return false;
    }

    return true;
}


function Ceny_CepKontrol(pAlan) {
    if (getTrimYap(pAlan).val().length == 0)
        return false;

    var deger = pAlan.val();
    if (deger[0] != '0' || deger[1] != '5' || deger.length != 11)
        return false;

    return true;
}

function Ceny_getAlanEsitlikKontrol(Obj1, Obj2, Msg, Mesaj) {
    var retDeger = true;
    $(Msg).text("");
    if ($(Obj1).val() != $(Obj2).val()) {
        $(Msg).text(Mesaj);
        retDeger = false;
    }
    return retDeger;
}



function Ceny_getEnAzUzunlukKontrol(Obj, Sayi, Msg, Mesaj) {
    var retDeger = true;    
    $(Msg).text("");
    if ($(Obj).val().length < Sayi) {
        retDeger = false;
        $(Msg).text(Mesaj);        
    }
    return retDeger;
}

function getCepTelKontrolum(CepTel, MsgCepTel, Mesaj) {   
    var retDeger = true;
    if (MsgCepTel != "")
        $(MsgCepTel).text("");
    if (Ceny_CepKontrol($(CepTel)) == false) {
        if (MsgCepTel != "")
            $(MsgCepTel).text(Mesaj);
        retDeger = false;
    }
    return retDeger;
}


function getCepTelKontrol(CepTel) {
   
    return getCepTelKontrolum(CepTel, "", "");
}


function Ceny_RakamGirilsin(e) {    
    var keyCode = event.keyCode;
    if ((keyCode < 46 || keyCode > 57) && keyCode != 8 && keyCode != 9 && keyCode != 0 && keyCode != 47 && keyCode != 37 && keyCode != 39  && (keyCode < 96 || keyCode > 105)) {
            return false;
        }
}

function Ceny_HarfGirilsin(e) {    
    var keyCode = event.keyCode;
    if ((keyCode < 64 || keyCode > 91) && keyCode != 8 && keyCode != 37 && keyCode != 39) {
        alert(k);
        return false;
    }
    

    return false;
}


function Ceny_Replace(deger, Char, ReplaceChar) {

    for (i = 0; i < deger.length; i++)
        deger = deger.replace(Char, ReplaceChar);   

    return deger;
}

/**EMAİL*/
function getEmailKontrol(Email, MsgEmail, Mesaj) {
    var retDeger = true;
    if (Ceny_MailKontrol(Email) == false) {
        if (MsgEmail != "")
            $(MsgEmail).text(Mesaj);
        retDeger = false;
    } else {
        if (MsgEmail != "")
            $(MsgEmail).text("");
    }
    
    return retDeger;
}

function getEnterSubmit(event, btnName) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $(btnName).click();
    }
}


/****TARİH********************/
function getTarihYap(txt) {
    $(txt).datetimepicker({
        format: 'd.m.Y',
        timepicker: false
    });
}

function getTarihZamanYap(txt, pStep) {
    $(txt).datetimepicker({
        step: pStep
    });
}



/*********DOSYA YÜKLE*********************/

function Ceny_getUrunResimTemizle(uploadBtn, uploadImg, result) {

    $(uploadBtn).click(function () { 
        $(uploadImg).val("");
        $(result).html("");
    });

    
}

function Ceny_getUrunResimListe(ResimAdi, ResultHtml, width, height) {
    var resValue = $(ResimAdi).val();
    var countryArray = resValue.split(';');
    var deger = "";
    for (var i = 0; i < countryArray.length; i++) {
        var strResim = countryArray[i];
        strResim = strResim.replace("~", "");
        if (strResim.length == 0)
            return;

        deger += "<img src=\"" + strResim + "\" width=\"" + width + "px\" height=\"" + height + "px\"/>"
    }
    $(ResultHtml).html(deger);
}

function Ceny_getDosyaYukleResimTEK(uploadBtn, uploadImg, result, width, height)
{
    Ceny_getDosyaYukleIslem(uploadBtn, uploadImg, result, "image/*", false, width, height);
}

function Ceny_getDosyaYukleResimCOKLU(uploadBtn, uploadImg, result, width, height) {
    Ceny_getDosyaYukleIslem(uploadBtn, uploadImg, result, "image/*", true, width, height);
}

function Ceny_getDosyaYukleIslem(uploadBtn, uploadImg, result, pFiletype, pMultiple, width, height)
{    
    var uploaderButton = $(uploadBtn);
    var interval;
    var isFileTypeOk = true;
    if (uploaderButton[0]) {
        new AjaxUpload(uploaderButton, {
            action: "/GenelIslem/DosyaYukleme",
            name: "uploadedFile",
            multiple: pMultiple,
            filetype: pFiletype,
            onSubmit: function (file, extension) {               

                isFileTypeOk = true;
                //Butonun metnini değiştiriyoruz
                //uploaderButton.text("Yükleniyor");
                window.clearInterval(interval);
                interval = window.setInterval(function () {
                    var text = uploaderButton.text();
                    if (text.length < 13) {
                        uploaderButton.text(text + '.');
                    } else {
                       // uploaderButton.text("Yükleniyor");
                    }
                }, 200);

            },
            onComplete: function (file, response) {
                window.clearInterval(interval);
                this.enable();
                //Başarılı
                //uploaderButton.text("Dosya Yükle");
                if (isFileTypeOk && response != "Hata") {
                    var resValue = $(uploadImg).val();
                    if (resValue.length > 0)
                        resValue += ";";
                    resValue = response;
                    $(uploadImg).val(resValue);
                    $(result).text("Dosya başarıyla yüklendi!");
                    if (width != null)
                    {
                        Ceny_getUrunResimListe(uploadImg, result, width, height)
                    }
                    //Dosya Format Hatası
                }
                else
                    $(result).text("Dosya Yükleme Hatası");
            }
        });
    }
}

/*********DOSYA YÜKLE*********************/


/********FCK EDİTOR****************/

function getFCKEditor(txt) {
    alert("aaaaaaaaaa");
    $(function () {
        CKEDITOR.replace(txt, {
            skin: 'kama',
            filebrowserBrowseUrl: '<%: Url.Content("~/ckeditor/ckfinder/ckfinder.html")%>',
            filebrowserImageBrowseUrl: '<%: Url.Content("~/ckeditor/ckfinder/ckfinder.html?type=Images")%>',
            filebrowserFlashBrowseUrl: '<%: Url.Content("~/ckeditor/ckfinder/ckfinder.html?type=Flash")%>',
            filebrowserUploadUrl: '<%: Url.Content("~/ckeditor/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Files")%>',
            filebrowserImageUploadUrl: '<%: Url.Content("~/ckeditor/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images")%>',
            filebrowserFlashUploadUrl: '<%: Url.Content("~/ckeditor/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Flash")%>'
        });
    });
}

/********FCK EDİTOR****************/




/*

$(window).load(function () {
    // Run code
    $("#loading").hide();
});

$(window).onload = new function () {
    // Run code
    $("#loading").show();
}*/


function getSepetAnimasyon_SepeteEkle(id, fiyatID, sayi, pUrun, pSepet) {
    getSepetAnimasyon(pUrun, pSepet);
    getUrunSepeteEkle(id, fiyatID, sayi);
}

function getKarsilastirChecked(obj, id, fiyatID, pUrun, pKarsilastir)
{
    var isChecked = $(obj+":checked").val() ? true : false;

    if (isChecked) {
        getSepetAnimasyon(pUrun, pKarsilastir);
        getUrunKarsilastirEkle(id, fiyatID);
    } else {
        getUrunKarsilastirmaCikar(id, fiyatID);
    }
}

function getKarsilastirChecked2() {
    alert("a");
}

function getSepetAnimasyon_Karsilastir(id, fiyatID, pUrun, pKarsilastir) {
    getSepetAnimasyon(pUrun, pKarsilastir);
    getUrunKarsilastirEkle(id, fiyatID);
}

function getSepetAnimasyon(pUrun, pSepet) {
    var cart = pSepet;
    var imgtodrag = pUrun;
    if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.5',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '100'
            })
            .appendTo($('body'))
            .animate({
                'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
            }, 1000, 'easeInOutExpo');

        setTimeout(function () {
            cart.effect("shake", {
                times: 2
            }, 200);
        }, 1500);

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function () {
            $(this).detach()
        });
    }
}

function getServisUrl(pServisName)
{
    var urlServis = "http://localhost:53645/MobilServis/" + pServisName;
    return urlServis;
    
}


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');	
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
		
    }
    return vars;
}

    function getDownloadDosyam(pathUrl, imgResim, pBoyut)
    {
        var dosyaTipi = pathUrl.substring(pathUrl.length - 4);
        pathUrl = pathUrl.replace(dosyaTipi, "_" + pBoyut + dosyaTipi);
   
        getDownloadDosya(pathUrl, imgResim);
    }


   function getDownloadDosya(pathUrl, imgResim)
	{ 	
		var fileTransferObj = new FileTransfer();
		var fileNameIndex = pathUrl.lastIndexOf("/") + 1
		var imgFileName = pathUrl.substring(fileNameIndex);	
		var localImgPath = cordova.file.dataDirectory+imgFileName;	
		window.resolveLocalFileSystemURL(localImgPath, function (file) {			
			document.getElementById(imgResim).src= localImgPath;			
		}, function (file) {
			fileTransferObj.download(
				pathUrl,
				localImgPath,
				function(girdi) {					
				    document.getElementById(imgResim).src = localImgPath;				   
				},
				function(hata) {
				    //alert("Hata: " + JSON.stringify(hata));
				    document.getElementById(imgResim).src = localImgPath;
				}
			);
	   }); 
	}		
  

  function getSession_SepeteEkle(UrunID, Adet) {
      var sepetDeger = "";
      var OncekiDeger = window.sessionStorage.getItem("SessionSepet");
      if (OncekiDeger == null) {
          OncekiDeger = "";
          OncekiDeger = UrunID + "#" + Adet;
      } else {
          var tempDeger = "";
          var boolSepetVar = false;
          var arrDeger = OncekiDeger.split(";");
          for (var i = 0 ; i < arrDeger.length ; i++) {
              var UrunSepet = arrDeger[i].split("#");
              if (UrunSepet.length > 0) {

                  if (UrunID == UrunSepet[0]) {
                      boolSepetVar = true;
                      if (parseInt(Adet) == 0)
                          continue;
                      UrunSepet[1] = parseInt(Adet);
                  }
                  if (tempDeger.length > 0) {
                      tempDeger += ";";
                  }
                  
                  tempDeger += UrunSepet[0] + "#" + UrunSepet[1];
              }
          }
          if (boolSepetVar == false) {
              if (arrDeger.length > 0) {
                  tempDeger += ";";
              }
              tempDeger += UrunID + "#" + Adet;
          }
          OncekiDeger = tempDeger;
      }
      window.sessionStorage.setItem("SessionSepet", OncekiDeger);
  }
  
  function exitFromApp()
	{
	  if (confirm("Kapatmak istediğinizden emin misiniz?")) {
		if (navigator.app) {
		   navigator.app.exitApp();
		}
		else if (navigator.device) {
			navigator.device.exitApp();
		}
	  }
	}
  
  
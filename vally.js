(function($) {
    "use strict";


    $.fn.vally = function(options) {
        var settings = {};
        
         var formIsNotValid = false;
            var firstError = true;
        // This is the easiest way to have default options.
        settings = $.extend({
            // These are the defaults.
            basicSubmit: true, //normal page submit
            ajaxSubmit: false,
            reactiveValidation: false,
            controls: [],
            onSubmit: function(e) {
                console.log("Default callback");
            }
        }, options);

        
        init();
        
        
        
        function init(){
            if(settings.reactiveValidation==true){
             $.each(settings.controls, function( index, value ) {
             
                 //focusout keyup keypress blur change
             $(settings.controls[index].selector).on('focusout keypress',function(e){
                 var firstErrorLocal=true;
                 $(this)[0].vallyConfig=settings.controls[index];
                console.log($(this)[0]) ;
                 
                 
                //code to check if control is valid
                 
                 for(var i=0;i<$(this)[0].vallyConfig.checkList.length;i++){
                     
                 var checkfor = $(this)[0].vallyConfig.checkList[i].name;
                        switch (checkfor) {

                            case 'required':
                                if (requiredChecker($($(this)[0].vallyConfig.selector))) {
                                   ;
                                    if (firstErrorLocal) {
                                        showErrorMessage($($(this)[0].vallyConfig.selector), $(this)[0].vallyConfig.checkList[i].errorMessage, true);
                                    }
                                    firstErrorLocal = false;
                                } else {
                                    showErrorMessage($($(this)[0].vallyConfig.selector), $(this)[0].vallyConfig.checkList[i].errorMessage, false);
                                }
                                break;

                            case 'pattern':
                                if (patternChecker($($(this)[0].vallyConfig.selector), $(this)[0].vallyConfig.checkList[i].regex)) {
                                   
                                    if (firstErrorLocal) {
                                        showErrorMessage($($(this)[0].vallyConfig.selector),$(this)[0].vallyConfig.checkList[i].errorMessage, true);
                                    }
                                    firstErrorLocal = false;
                                } else {
                                    showErrorMessage($($(this)[0].vallyConfig.selector),$(this)[0].vallyConfig.checkList[i].errorMessage, false);
                                }

                                break;

                        }
                 
                 
                 
                 
             }
                 
                 
                 
                 
                 
                 
                 
                 
                 
             });    
                 
                 
            });   
                     
            }
            
            
        }


        $(this).submit(function(e) {

            if (isNotValidForm()) {

                return false;
            }

            settings.onSubmit();
            if (settings.basicSubmit == false && settings.ajaxSubmit == true) {
                e.preventDefault();
                return
            }


            console.log("normal submit");
        });








        function showErrorMessage(instanceParam, text, bool) {
            if (bool && !instanceParam.next().hasClass('vally-box')) {
                instanceParam.after('<div class="vally-box">' + text + '</div>');
            }
            else
            if (bool && instanceParam.next().hasClass('vally-box')) {
                instanceParam.next().remove('.vally-box');
                instanceParam.after('<div class="vally-box">' + text + '</div>');
            }
            else {
                instanceParam.next().remove('.vally-box');
            }
        }



        function isNotValidForm() {

           
            var controls = settings.controls;
            if (controls.length != 0) {


                for (var i = 0; i < controls.length; i++) {

                    for (var j = 0; j < controls[i].checkList.length; j++) {

                        var checkfor = controls[i].checkList[j].name;
                        switch (checkfor) {

                            case 'required':
                                if (requiredChecker($(controls[i].selector))) {
                                    formIsNotValid = true;
                                    if (firstError) {
                                        showErrorMessage($(controls[i].selector), controls[i].checkList[j].errorMessage, true);
                                    }
                                    firstError = false;
                                } else {
                                    showErrorMessage($(controls[i].selector), controls[i].checkList[j].errorMessage, false);
                                }
                                break;

                            case 'pattern':
                                if (patternChecker($(controls[i].selector), controls[i].checkList[j].regex)) {
                                    formIsNotValid = true;
                                    if (firstError) {
                                        showErrorMessage($(controls[i].selector), controls[i].checkList[j].errorMessage, true);
                                    }
                                    firstError = false;
                                } else {
                                    showErrorMessage($(controls[i].selector), controls[i].checkList[j].errorMessage, false);
                                }

                                break;

                        }
                    }

                }

            }

            return formIsNotValid;

        }



        function requiredChecker(controlInstance) {
            var value = controlInstance.val();

            if (isEmpty(value)) {
                return true;
            } else {
                return false;
            }
        }

        function isEmpty(str) {
            return (!str || 0 === str.length);
        }

        function patternChecker(controlInstance, regexParam) {
            var value = controlInstance.val();
            var regex = new RegExp(regexParam);
            // var flag = regex.test(value);
            var flag = /\d/.test(value);


            if (!flag) {
                return true;
            } else {
                return false;
            }

        }











        /*  
          function isNotValidForm() {

              var errorMessages = {
                  enterName: 'Please enter your name',
                  enterEmail: 'Please enter a valid email address',
                  enterContact: 'Please enter a valid number',
                  enterFile: 'Please enter a valid file'

              };

              var formIsNotValid = false;
              var firstError = true;



              if ($('#firstname').val() == "") {
                  formIsNotValid = true;
                  if (firstError)
                      showErrorMessage($('#firstname'), errorMessages.enterName, true);
                  firstError = false;
              }


              var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              var flag = !regex.test($('#email').val());
              if ($('#email').val() == "" || flag) {
                  formIsNotValid = true;
                  if (firstError)
                      showErrorMessage($('#email'), errorMessages.enterEmail, true);
                  firstError = false;
              }


              if ($('#contactNumber').val() != "") {
                  var flag1 = !($('#contactNumber').val().length >= 10 && $('#contactNumber').val().length <= 15);
                  if (flag1) {
                      formIsNotValid = true;
                      if (firstError)
                          showErrorMessage($('#contactNumber'), errorMessages.enterContact, true);
                      firstError = false;
                  }
              }


              var ext = $('#uploadFile').val().split('.').pop().toLowerCase();
              if ($.inArray(ext, ['doc', 'docx', 'jpg', 'pdf']) == -1) {
                  formIsNotValid = true;
                  if (firstError)
                      showErrorMessage($('#uploadFile'), errorMessages.enterFile, true);
                  firstError = false;
              }


              return formIsNotValid;

          }*/


        return this;
    };

}(jQuery));

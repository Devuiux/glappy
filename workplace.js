/* //checkout.iglobalstores.com/js/igc.cs.main.js */
function getCountry() {
    try {
        return getSelectedCountry();
    } catch (err) {
        return null;
    }
}

/*jdev
  Adding variable that are related to the order */
var domesticShippingCharge = "",
    misc1 = "",
    misc2 = "",
    misc3 = "",
    misc4 = "",
    misc5 = "",
    misc6 = "",
    customerName = "",
    customerCompany = "",
    customerEmail = "",
    customerPhone = "",
    customerAltPhone = "",
    customerAddress1 = "",
    customerAddress2 = "",
    customerCity = "",
    customerState = "",
    customerCountry = "",
    customerZip = "",
    shippingAmountOverride = "",
    customerNote = "";
/*jdev*/

function log(msg) { //logging for testing purposes
    if (window.console && console.log && typeof console.log != "undefined") {
        console.log(msg);
    }
}

function igcCreateQueryString(id, items) {
    var q = "?";
    q += ("store=" + id);
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        q += ("&itemDescription" + (i + 1) + "=" + encodeURIComponent(item["itemDescription"]));
        q += ("&itemQuantity" + (i + 1) + "=" + encodeURIComponent(item["itemQuantity"]));
        q += ("&itemUnitPrice" + (i + 1) + "=" + encodeURIComponent(item["itemUnitPrice"].replace(/[\jQuery,]/g, '')));
        if (item["itemImageURL"]) {
            q += ("&itemImageURL" + (i + 1) + "=" + encodeURIComponent(item["itemImageURL"]));
        }
        if (item["itemSku"]) {
            q += ("&itemSku" + (i + 1) + "=" + encodeURIComponent(item["itemSku"]));
        }
        if (item["itemProductId"]) {
            q += ("&itemProductId" + (i + 1) + "=" + encodeURIComponent(item["itemProductId"]));
        }
        if (item["itemWeight"]) {
            q += ("&itemWeight" + (i + 1) + "=" + encodeURIComponent(item["itemWeight"]));
        }
        if (item["itemHeight"]) {
            q += ("&itemHeight" + (i + 1) + "=" + encodeURIComponent(item["itemHeight"]));
        }
        if (item["itemURL"]) {
            q += ("&itemURL" + (i + 1) + "=" + encodeURIComponent(item["itemURL"]));
        }
        if (item["itemLength"]) {
            q += ("&itemLength" + (i + 1) + "=" + encodeURIComponent(item["itemLength"]));
        }
        if (item["itemWidth"]) {
            q += ("&itemWidth" + (i + 1) + "=" + encodeURIComponent(item["itemWidth"]));
        }
        if (item["itemStatus"]) {
            q += ("&itemStatus" + (i + 1) + "=" + encodeURIComponent(item["itemStatus"]));
        }
    }
    return q;
}

function igcGoToCheckout(id) {
    try {
        // companyies using form submit
        if (true) {
            igcDoFormSubmit(id);
            return;
        } else {
            var items = igcGetItems();
            if (!items || items.length < 1) {
                alert("Please add something to your cart, then come back and checkout.");
                return;
            }
            var queryString = igcCreateQueryString(id, items);
            var url = "https://" + getSubDomain() + ".iglobalstores.com/ice.jsp" + queryString;
            window.location = url;
        }
    } catch (err) {
        alert("We are sorry, something went wrong.  Please call us at (1) 801.478.2511. We will help you with your order!");
        log(err);
        return;
    }
}

function getSubDomain() {
    return "checkout";
}

// ========== FORM SUBMIT ===============

function igcDoFormSubmit(id) {
    //empty form if exists
    if (jQuery('#igcForm').length > 0) {
        jQuery('#igcForm').empty();
    } else { //create form
        var form = jQuery('<form/>');
        var country = getCountry();
        var igSubdomain = "checkout";
        try {
            igSubdomain = ig_getSubDomain();
        } catch (err) {
            try {
                igSubdomain = getSubDomain();
            } catch (error) {
                //continue with checkout subdomain
            }
        }
        form.attr('action', "https://" + igSubdomain + ".iglobalstores.com/ice.jsp" + ((country) ? ("?country=" + country) : ""))
            .attr('method', 'post')
            .attr('id', 'igcForm')
            .attr('accept-charset', 'utf8') //jdev
            .appendTo(document.body);
    }
    if (igcDoFormFillForm()) {
        jQuery("#igcForm").append("<input type=\"hidden\" name=\"store\"  value=\"" + id + "\" />");

        setTimeout(function() {

            if (hasUpsell) {
                iframeLoaded();
            } else {
                jQuery('#igcForm').submit().remove();
            }
        }, 500);
    }

}

function iframeLoaded() {

    jQuery('#faceboxsubmit').on('click', function(e) {
        console.log('rebuild form');
        e.preventDefault();

        $.ajax({
            url: '/cart',
            success: function(data) {
              jQuery('#ig-cart-items' ).html(jQuery( data ).find( '.ig-cart-item' ));
              hasUpsell = false;
              igcCheckout();
            },
        });

        return false;
    });
}

function igcDoFormFillForm() {
    try {
        var items = igcGetItems();
        if (!items || items.length < 1) {
            alert("Please add something to your cart, then come back and checkout.");
            return false;
        } else {
            igcDoFormAddItemsToForm(items);
            igcDoFormAddInfosToForm(); //jdev
            return true;
        }
    } catch (err) {
        alert("It appears that an error has occurred. Please check to make sure your item is added to your cart and ensure you are using an up-to-date internet browser.");
        log(err); //jdev
        return false;
    }
}

function igcDoFormAddInfosToForm() {
    /*jdev
      Adding the order infos */
    jQuery('<input type="hidden" name="domesticShippingCharge" value="' + domesticShippingCharge + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="misc1" value="' + misc1 + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="misc2" value="' + misc2 + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="misc3" value="' + misc3 + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="misc4" value="' + misc4 + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="misc5" value="' + misc5 + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="misc6" value="' + misc6 + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerName" value="' + customerName + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerCompany" value="' + customerCompany + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerEmail" value="' + customerEmail + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerPhone" value="' + customerPhone + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerAltPhone" value="' + customerAltPhone + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerAddress1" value="' + customerAddress1 + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerAddress2" value="' + customerAddress2 + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerCity" value="' + customerCity + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerState" value="' + customerState + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerCountry" value="' + customerCountry + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerZip" value="' + customerZip + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="customerNote" value="' + customerNote + '" />').appendTo('#igcForm');
    jQuery('<input type="hidden" name="shippingAmountOverride" value="' + shippingAmountOverride + '" />').appendTo('#igcForm');
    /*jdev*/
}

function igcDoFormAddItemsToForm(items) {

    jQuery(items).each(function(i, item) {
        var params = [
            "itemDescription",
            "itemQuantity",
            "itemUnitPrice",
            "itemImageURL",
            "itemURL",
            "itemWeight",
            "itemWeightUnits",
            "itemLength",
            "itemWidth",
            "itemHeight",
            "itemProductId",
            "itemSku",
            "itemNonShippable",
            "itemBrand",
            "itemCustomization",
            "itemStatus",
            "itemDescriptionLong",
            "itemDescriptionDetailed",
            "itemFabricContent",
            "itemColor",
            "itemLtlClass",
            "itemMaterial",
            "itemCountryOfOrigin",
            "itemCategory",
            "itemHSCode"
        ];
        jQuery(params).each(function(index, param) {
            if (item[param]) {
                if (param == "itemUnitPrice") {
                    //item[param] = item[param].replace(/\jQuery/g,'');
                    item[param] = item[param].replace(/[^0-9.-]/g, '');
                }
                jQuery(document.createElement('input'))
                    .attr('type', 'hidden')
                    .attr('name', param + (i + 1))
                    .attr('value', item[param])
                    .appendTo('#igcForm');
            }
        });
    });


}

/* //checkout.iglobalstores.com/js/igc.cs.modko.js?1 */

function ig_getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getSelectedCountry() {
    return ig_country;
}

function igcCheckout() {
    igcGoToCheckout('506');
}

function getSubDomain() {
    return "modko";
}

function igcGetItems() {

    var items = new Array();
    var itemRows = jQuery(".ig-cart-item");
    jQuery(itemRows).each(function() {
        var $item = jQuery(this);
        items.push({
            "itemDescription": jQuery.trim($item.data('name')),
            "itemQuantity": $item.data('qty'),
            "itemUnitPrice": (parseFloat($item.data('price')) / 100).toString(),
            "itemURL": $item.data('url'),
            "itemImageURL": $item.data('img'),
            "itemSku": $item.data('sku'),
            "itemProductId": $item.data('product'),
            "itemWeight": $item.data('weight') || null,
            "itemWeightUnits": "G"
        });

    });
    return items;
}


//domestic configuration
function ig_domesticActions() {
    jQuery('.shipping-calculator').show();
}

//international configuration
function ig_internationalActions() {
    //take over button
    console.log("international");
    jQuery('.shipping-calculator').hide();
}

//for when the country is changed
function ig_ice_countryChanged() {

    if (!ig_isDomesticCountry()) {

        ig_internationalActions();

    } else {

        ig_domesticActions();

    }

}

function igcIceReady() {
    //button on the menu modal
    var sideMenuButton = jQuery("a[href='/checkout']");
    sideMenuButton.click(function() {
        if (ig_country) {
            if (!ig_isDomesticCountry()) {
                igcCheckout();
                return false;
            } else {
                return true;
            }
        }
    });

    //main checkout button in cart
    if (window.location.href.indexOf("cart") != -1) {
        if (!ig_isDomesticCountry()) {
            ig_internationalActions();
        }

        var checkoutButton = jQuery('#checkout');

        /*
        $( "#cart_form" ).click(function( event ) {


            if (ig_country) {
                if (!ig_isDomesticCountry()) {
                    igcCheckout();
                    return false;
                } else {
                    return true;
                }
            }
        });*/

        checkoutButton.click(function(event) {
            if (ig_country) {
                if (!ig_isDomesticCountry()) {
                    event.preventDefault();
                    igcCheckout();
                    return false;
                } else {
                    return true;
                }
            }
        });


    }

}

//Testing mode, remove this requirement for the iGlobal url param, to make a site live
// var iGlobalUrlParam = ig_getParameterByName("iGlobal");
//if (iGlobalUrlParam === "true") {

// console.log("no param reqs");
jQuery(document).ready(function() {

//     console.log("ready");
    igcIceReady();
  
});

//}
//}

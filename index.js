/*global require*/
'use strict';

var mappings = require('./prod_vendor_mappings.json');
var find = require('lodash/find');

module.exports = function (manufacturer, family, product_name) {
    manufacturer = manufacturer || '';
    product_name = product_name || '';
    family = family || '';
    var vendors      = mappings.manufacturers;
    var virtual      = mappings.product_names.virtual;
    var physical     = mappings.product_names.physical;
    var families     = mappings.families;
    var lcFamily       = family.toLowerCase();
    var lcProduct      = product_name.toLowerCase();
    var lcManufacturer = manufacturer.toLowerCase();
    var returnObj      = {
        manufacturer: manufacturer,
        family: family,
        product_name: product_name,
        isVirtual: false,
        type: 'Unknown'
    };

    checkGrayAndBlackLists(returnObj, lcManufacturer, lcFamily, lcProduct);

    // Checks if the manufacturer, product_name, and/or family
    // equal each other.
    //
    // Manufacturer takes precedent over families and products
    // that are not in the vendor mappings when two or more are equal.
    var phyProd = find(physical, {lcString: lcProduct});
    var virtProd = find(virtual, {lcString: lcProduct});
    var fam = find(families, {lcString: lcFamily});
    var virtMan = find(vendors.virtual, {lcString: lcManufacturer});
    var otherMan = find(vendors.other, {lcString: lcManufacturer});
    if (lcProduct === lcManufacturer &&
        lcManufacturer === lcFamily) {
        switch(true) {
            case phyProd:
                returnObj.manufacturer = 'Unknown';
                returnObj.family = 'Unknown';
            break;
            case virtProd:
                returnObj.isVirtual = true;
                returnObj.manufacturer = 'Unknown';
                returnObj.family = 'Unknown';
            break;
            case fam:
                returnObj.manufacturer = 'Unknown';
                returnObj.product_name = 'Unknown';
            break;
            case virtMan:
                returnObj.isVirtual = true;
                returnObj.product_name = 'Unknown';
                returnObj.family = 'Unknown';
            break;
            default:
                returnObj.product_name = 'Unknown';
                returnObj.family = 'Unknown';
            break;
        }
    } else if (lcProduct === lcManufacturer) {
        if (virtProd) {
            returnObj.isVirtual = true;
            returnObj.manufacturer = 'Unknown';
        } else if (virtMan) {
            returnObj.isVirtual = true;
            returnObj.product_name = 'Unknown';
        } else if (phyProd) {
            returnObj.manufacturer = 'Unknown';
        } else {
            returnObj.product_name = 'Unknown';
        }
    } else if (lcFamily === lcProduct) {
        // Product takes precedent over family
        if (fam) {
            returnObj.product = 'Unknown';
        } else if (virtProd) {
            returnObj.isVirtual = true;
            returnObj.family = 'Unknown';
        } else {
            returnObj.family = 'Unknown';
        }
    } else if (lcManufacturer === lcFamily) {
        if (fam) {
            returnObj.manufacturer = 'Unknown';
        } else if (virtMan) {
            returnObj.isVirtual = true;
            returnObj.family = 'Unknown';
        } else {
            returnObj.family = 'Unknown';
        }
    }

    if (fam && returnObj.fam !== 'Unknown') {
        returnObj.family = fam.string;
    }

    if (virtMan && returnObj.manufacturer !== 'Unknown') {
        returnObj.isVirtual = true;
        returnObj.manufacturer = virtMan.string;
        returnObj.type = 'Virtual';
    } else if (otherMan && returnObj.manufacturer !== 'Unknown') {
        returnObj.manufacturer = otherMan.string;
    }

    if (virtProd && returnObj.product_name !== 'Unknown') {
        returnObj.product_name = virtProd.string;
        returnObj.isVirtual = true;
        returnObj.type = 'Virtual';
    } else if (phyProd && returnObj.product_name !== 'Unknown') {
        returnObj.product_name = phyProd.string;
        returnObj.type = 'Physical';
    }

    // looks to see if the manufacturer, product_name,
    // and family strings contain any virtual system
    // strings.
    isVirtual(returnObj);

    return returnObj;
};

function isVirtual(returnObj) {
    var manufacturer = returnObj.manufacturer.toLowerCase();
    var fam = returnObj.family.toLowerCase();
    var product = returnObj.product_name.toLowerCase();

    if (!returnObj.isVirtual) {
        mappings.virtualStrings.forEach(function (str) {
            if (!returnObj.isVirtual && (manufacturer.includes(str) ||
                fam.includes(str) || product.includes(str))) {
                returnObj.isVirtual = true;
                returnObj.type = 'Virtual';
            }
        });
    }
}

function checkGrayAndBlackLists(returnObj, lcManufacturer, lcFamily, lcProduct) {
    mappings.graylist.forEach(function (val) {
        switch (val.lcString) {
            case lcProduct:
                returnObj.product_name = val.string;
            break;
            case lcFamily:
                returnObj.family = val.string;
            break;
            case lcManufacturer:
                returnObj.manufacturer = val.string;
            break;
        }
    });

    if (find(mappings.blacklist, {lcString: lcManufacturer})) {
        returnObj.manufacturer = 'Unknown';
    }

    if (find(mappings.blacklist, {lcString: lcProduct})) {
        returnObj.product_name = 'Unknown';
    }

    if (find(mappings.blacklist, {lcString: lcFamily})) {
        returnObj.family = 'Unknown';
    }
}
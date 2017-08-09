/*global require*/
'use strict';

const mappings = require('./prod_vendor_mappings.json');
const find = require('lodash/find');

module.exports = function (manufacturer, family, product_name) {
    manufacturer = manufacturer || '';
    product_name = product_name || '';
    family = family || '';
    let vendors      = mappings.manufacturers;
    let virtual      = mappings.product_names.virtual;
    let physical     = mappings.product_names.physical;
    let families     = mappings.families;
    let lcFamily       = family.toLowerCase();
    let lcProduct      = product_name.toLowerCase();
    let lcManufacturer = manufacturer.toLowerCase();
    let isVirtual      = false;
    let returnObj      = {
        manufacturer: manufacturer,
        family: family,
        product_name: product_name,
        type: 'Unknown'
    };

    checkGrayAndBlackLists(returnObj, lcManufacturer, lcFamily, lcProduct);

    // Checks if the manufacturer, product_name, and/or family
    // equal each other.
    //
    // Manufacturer takes precedent over families and products
    // that are not in the vendor mappings when two or more are equal.
    let phyProd = find(physical, {lcString: lcProduct});
    let virtProd = find(virtual, {lcString: lcProduct});
    let fam = find(families, {lcString: lcFamily});
    let virtMan = find(vendors.virtual, {lcString: lcManufacturer});
    let otherMan = find(vendors.other, {lcString: lcManufacturer});
    if (lcProduct === lcManufacturer &&
        lcManufacturer === lcFamily) {
        switch(true) {
            case phyProd:
                returnObj.manufacturer = 'Unknown';
                returnObj.family = 'Unknown';
            break;
            case virtProd:
                isVirtual = true;
                returnObj.manufacturer = 'Unknown';
                returnObj.family = 'Unknown';
            break;
            case fam:
                returnObj.manufacturer = 'Unknown';
                returnObj.product_name = 'Unknown';
            break;
            case virtMan:
                isVirtual = true;
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
            isVirtual = true;
            returnObj.manufacturer = 'Unknown';
        } else if (virtMan) {
            isVirtual = true;
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
            isVirtual = true;
            returnObj.family = 'Unknown';
        } else {
            returnObj.family = 'Unknown';
        }
    } else if (lcManufacturer === lcFamily) {
        if (fam) {
            returnObj.manufacturer = 'Unknown';
        } else if (virtMan) {
            isVirtual = true;
            returnObj.family = 'Unknown';
        } else {
            returnObj.family = 'Unknown';
        }
    }

    if (fam && returnObj.fam !== 'Unknown') {
        returnObj.family = fam.string;
    }

    if (virtMan && returnObj.manufacturer !== 'Unknown') {
        isVirtual = true;
        returnObj.manufacturer = virtMan.string;
        returnObj.type = 'Virtual';
    } else if (otherMan && returnObj.manufacturer !== 'Unknown') {
        returnObj.manufacturer = otherMan.string;
    }

    if (virtProd && returnObj.product_name !== 'Unknown') {
        returnObj.product_name = virtProd.string;
        isVirtual = true;
        returnObj.type = 'Virtual';
    } else if (phyProd && returnObj.product_name !== 'Unknown') {
        returnObj.product_name = phyProd.string;
        returnObj.type = 'Physical';
    }

    if (isVirtual) {
        returnObj.type = 'Virtual';
    }

    // looks to see if the manufacturer, product_name,
    // and family strings contain any virtual system
    // strings.
    isVirtualSystem(returnObj);

    return returnObj;
};

function isVirtualSystem(returnObj) {
    let manufacturer = returnObj.manufacturer.toLowerCase();
    let fam = returnObj.family.toLowerCase();
    let product = returnObj.product_name.toLowerCase();

    if (returnObj.type !== 'Virtual') {
        mappings.virtualStrings.forEach(function (str) {
            if (returnObj.type !== 'Virtual' && (manufacturer.includes(str) ||
                fam.includes(str) || product.includes(str))) {
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
const mappings = require('./prod_vendor_mappings.json');
const find = require('lodash/find');

module.exports = function (manufacturer, family, product_name) {
    manufacturer = manufacturer || '';
    product_name = product_name || '';
    family = family || '';
    const vendors      = mappings.manufacturers;
    const virtual      = mappings.product_names['virtual'];
    const physical     = mappings.product_names['physical'];
    const families     = mappings.families;
    let lcFamily       = family.toLowerCase();
    let lcProduct      = product_name.toLowerCase();
    let lcManufacturer = manufacturer.toLowerCase();
    let returnObj      = {
        manufacturer: manufacturer,
        family: family,
        product_name: product_name,
        isVirtual: false
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
    } else if (otherMan && returnObj.manufacturer !== 'Unknown') {
        returnObj.manufacturer = otherMan.string;
    }

    if (virtProd && returnObj.product_name !== 'Unknown') {
        returnObj.product_name = virtProd.string;
        returnObj.isVirtual = true;
    } else if (phyProd && returnObj.product_name !== 'Unknown') {
        returnObj.product_name = phyProd.string;
    }

    return returnObj;
};

function checkGrayAndBlackLists(vendor_obj, lcManufacturer, lcFamily, lcProduct) {
    mappings.graylist.forEach(function (val) {
        switch (val.lcString) {
            case lcProduct:
                vendor_obj.product_name = val.string;
            break;
            case lcFamily:
                vendor_obj.family = val.string;
            break;
            case lcManufacturer:
                vendor_obj.manufacturer = val.string;
            break;
        };
    });

    if (find(mappings.blacklist, {lcString: lcManufacturer})) {
        vendor_obj.manufacturer = 'Unknown';
    }

    if (find(mappings.blacklist, {lcString: lcProduct})) {
        vendor_obj.product_name = 'Unknown';
    }

    if (find(mappings.blacklist, {lcString: lcFamily})) {
        vendor_obj.family = 'Unknown';
    }
}

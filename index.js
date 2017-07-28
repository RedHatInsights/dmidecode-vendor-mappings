const lc_vendor_map   = require('./lc_vendor_mappings.json');
const vendor_mappings = require('./vendor_mappings.json');

module.exports = function (manufacturer, family, product_name) {
    const vendors      = lc_vendor_map.manufacturers;
    const virtual      = lc_vendor_map.product_names['virtual'];
    const physical     = lc_vendor_map.product_names['physical'];
    const families     = lc_vendor_map.families;
    let lcFamily       = family.toLowerCase();
    let lcProduct      = product_name.toLowerCase();
    let lcManufacturer = manufacturer.toLowerCase();
    let returnObj      = {
        manufacturer: manufacturer,
        family: family,
        product_name: product_name,
        isVirtual: false
    }

    checkGrayAndBlackLists(returnObj, lcManufacturer, lcFamily, lcProduct);

    // Checks if the manufacturer, product_name, and/or family
    // equal each other.
    if (lcProduct === lcManufacturer &&
        lcManufacturer === lcFamily) {
        // defaults to only keeping the manufacture name.
        switch(true) {
            case physical.indexOf(lcProduct) >= 0:
                returnObj.manufacturer = 'Unknown';
                returnObj.family = 'Unknown';
                break;
            case virtual.indexOf(lcProduct) >= 0:
                returnObj.isVirtual = true;
                returnObj.manufacturer = 'Unknown';
                returnObj.family = 'Unknown';
                break;
            case families.indexOf(lcFamily) >= 0:
                returnObj.manufacturer = 'Unknown';
                returnObj.product_name = 'Unknown';
                break;
            case vendor.virtual.indexOf(lcManufacturer):
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
        switch(true) {
            case vendors.virtual.indexOf(lcManufacturer) >= 0:
                returnObj.isVirtual = true;
                returnObj.product_name = 'Unknown';
                break;
            case physical.indexOf(lcProduct) >= 0:
                returnObj.manufacturer = 'Unknown';
                break;
            case virtual.indexOf(lcProduct) >= 0:
                returnObj.isVirtual = true;
                returnObj.manufacturer = 'Unknown';
                break;
            default:
                returnObj.product_name = 'Unknown';
                break;
        }
    } else if (lcFamily === lcProduct) {
        if (families.indexOf(lcFamily) >= 0) {
            returnObj.product = 'Unknown';
        } else {
            returnObj.family = 'Unknown';
        }
    } else if (lcManufacturer === lcFamily) {
        if (families.indexOf(lcFamily) >= 0) {
            returnObj.manufacturer = 'Unknown';
        } else {
            returnObj.family = 'Unknown';
        }
    } else {
        if ((index = families.indexOf(lcFamily)) >= 0) {
            returnObj.family = vendor_mappings.families[index];
        }

        if ((index = vendors.virtual.indexOf(lcManufacturer)) >= 0) {
            returnObj.isVirtual = true;
            returnObj.manufacturer = vendor_mappings.manufacturers.virtual[index];
        } else if ((index = vendors.other.indexOf(lcManufacturer)) >= 0) {
            returnObj.manufacturer = vendor_mappings.manufacturers.other[index];
        }

        if ((index = virtual.indexOf(lcProduct)) >= 0) {
            returnObj.product_name = vendor_mappings.product_names['virtual'][index];
            returnObj.isVirtual = true;
        } else if ((index = physical.indexOf(lcProduct)) >= 0) {
            returnObj.product_name = vendor_mappings.product_names['physcial'][index];
        }
    }

    if (!returnObj.isVirtual) {
        returnObj.isVirtual
    }

    return returnObj;
}

function checkGrayAndBlackLists(vendor_obj, lcManufacturer, lcFamily, lcProduct) {
    let keys = Object.keys(vendor_mappings.graylist);

    keys.forEach(function (key) {
        switch (key.toLowerCase()) {
            case lcProduct:
                vendor_obj.product_name = vendor_mappings.graylist[key];
                break;
            case lcFamily:
                vendor_obj.family = vendor_mappings.graylist[key];
                break;
            case lcManufacturer:
                vendor_obj.manufacturer = vendor_mappings.graylist[key];
                break;
        };
    });

    if (lc_vendor_map.blacklist.indexOf(lcManufacturer) >= 0) {
        vendor_obj.manufacturer = 'Unknown';
    }

    if (lc_vendor_map.blacklist.indexOf(lcProduct) >= 0) {
        vendor_obj.product_name = 'Unknown';
    }

    if (lc_vendor_map.blacklist.indexOf(lcFamily) >= 0) {
        vendor_obj.family = 'Unknown';
    }
}

SalesforceInteractions.setLoggingLevel(3);
SalesforceInteractions.init({ // Initializes the Personalization module of the Salesforce Interactions SDK 
    cookieDomain: "gamestop.ca", // Optional tracking cookie domain configuration (overrides default)
}).then(() => {
    const sitemapConfig = { // Sitemap configuration object 
        global: {
            locale: "en_CA"
        }, // Object used to contain Global site object configuration 
        pageTypes: [{
            isMatch: () => {
                return window.location.pathname == "/" ||
                    window.location.pathname == "/Home/Index";
            },
            name: "Homepage",
            interaction: {
                name: "Homepage Visit",
            },
            contentZones: [{
                name: "home_hero",
                selector: "div#slider-hero"
            }]
        },
        {
            name: "search_results",
            isMatch: () => /\/SearchResult/.test(window.location.pathname),
            interaction: {
                name: "search_results",
                searchText: window.location.search.replaceAll('?q=', '').replaceAll('+', ' ')
            },
        },
        /* {
            name: "products",
            isMatch: () =>
                new Promise((resolve, reject) => {
                    console.log('Products is match')
                    //debugger;
                    let isMatchPDP = setTimeout(() => {
                        resolve(false);
                    }, 50);
                    return SalesforceInteractions.DisplayUtils.pageElementLoaded(
                        "div.prodTitle",
                        "html",
                    ).then(() => {
                        clearTimeout(isMatchPDP);
                        resolve(true);
                    });
                }),
            interaction: {
                name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
                catalogObject: {
                    id: SalesforceInteractions.cashDom('input[name="productId"]').val(),
                    name: SalesforceInteractions.resolvers.fromSelector('.prodTitle > h1 > span', (desc) => desc.trim()),
                    imageUrl: SalesforceInteractions.resolvers.fromSelectorAttribute('#packshotImage', 'src'),
                    inventoryCount: 1,
                    price: 1
                }
            },
            listeners: [
                SalesforceInteractions.listener("click", "#btnAddToCartPDP", () => {
                    console.log('Use clicked on add to cart');
                    debugger;
                    // Interaction structure 
                    var interactionObject = {
                        interaction: {
                            name: 'Add To Cart',
                            lineItem: {
                                catalogObjectType: "Product",
                                catalogObjectId: SalesforceInteractions.cashDom('input[name="productId"]').val(),
                                price: 1,
                                quantity: 1,
                            }
                        }
                    }

                    SalesforceInteractions.sendEvent(interactionObject);

                }),
            ],
            contentZones: [
                {
                    name: "product_recommendations",
                    selector: ".prodSugg"
                }
            ]
        } */

        {
            name: "product_detail",
            isMatch: () =>
                new Promise((resolve, reject) => {
                    console.log("Products is match");
                    //debugger;
                    let isMatchPDP = setTimeout(() => {
                        resolve(false);
                    }, 50);
                    return SalesforceInteractions.DisplayUtils.pageElementLoaded(
                        "div.prodTitle",
                        "html"
                    ).then(() => {
                        clearTimeout(isMatchPDP);
                        resolve(true);
                    });
                }),
            // Method 1 
            // interaction: {
            //     name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            //     catalogObject: {
            //         type: "Product",
            //         id: SalesforceInteractions.cashDom('input[name="productId"]').val(),
            //         attributes: {
            //             sku: {
            //                 id: SalesforceInteractions.cashDom('input[name="productId"]').val()
            //             },
            //             name: SalesforceInteractions.resolvers.fromSelector('.prodTitle > h1 > span', (desc) => desc.trim()),
            //             description: SalesforceInteractions.resolvers.fromSelector('#mainDescription > div', (desc) => desc.trim().replaceAll('\n', '<br>')),
            //             imageUrl: SalesforceInteractions.resolvers.fromSelectorAttribute('#packshotImage', 'src'),
            //             inventoryCount: 1,
            //             price: SalesforceInteractions.resolvers.fromSelector('.prodPriceCont.valuteCont.pricetext', (price) => parseFloat(price.replace(/[^0-9\.]+/g, "")))()
            //         },
            //     },
            // },

            // Method 2 
            interaction: {
                name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
                catalogObject: {
                    type: "Product",
                    id: SalesforceInteractions.resolvers.fromJsonLd("0.sku"),
                    attributes: {
                        sku: {
                            id: SalesforceInteractions.resolvers.fromJsonLd("0.sku")
                        },
                        name: SalesforceInteractions.resolvers.fromJsonLd("0.name"),
                        description: SalesforceInteractions.resolvers.fromJsonLd("0.description"),
                        imageUrl: SalesforceInteractions.resolvers.fromJsonLd("0.image.0"),
                        inventoryCount: 1,
                        price: SalesforceInteractions.resolvers.fromJsonLd("0.offers.0.price"),
                        relatedCatalogObjects: {
                            Category: () => {
                                console.log('Category is ' , SalesforceInteractions.resolvers.fromJsonLd("0.category")() )
                                return [SalesforceInteractions.resolvers.fromJsonLd("0.category")() ]
                            },
                            Brand: [
                                SalesforceInteractions.resolvers.fromJsonLd("0.brand.name")() 
                            ]
                        },
                    },
                },
            },
            listeners: [
                SalesforceInteractions.listener("click", "#btnAddToCartPDP", () => {
                    console.log("Use clicked on add to cart");
                    debugger;
                    // Interaction structure
                    var interactionObject = {
                        interaction: {
                            name: "Add To Cart",
                            lineItem: {
                                catalogObjectType: "Product",
                                catalogObjectId: SalesforceInteractions.cashDom(
                                    'input[name="productId"]'
                                ).val(),
                                price: 1,
                                quantity: 1,
                            },
                        },
                    };

                    SalesforceInteractions.sendEvent(interactionObject);
                }),
            ],
            contentZone: [
                {
                    name: "product_recommendations",
                    selector: ".prodSugg",
                },
            ],
        },
        ], // Array used to contain the page type object configurations 
    };
    SalesforceInteractions.initSitemap(sitemapConfig); // Initializes the Sitemap 
});
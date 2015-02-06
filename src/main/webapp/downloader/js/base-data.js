
var shipTypes = [
    {label:'Undefined',      value: 'UNDEFINED'},
    {label:'Wig',            value: 'WIG'},
    {label:'Pilot',          value: 'PILOT'},
    {label:'Sar',            value: 'SAR'},
    {label:'Tug',            value: 'TUG'},
    {label:'Port Tender',    value: 'PORT_TENDER'},
    {label:'Anti Pollution', value: 'ANTI_POLLUTION'},
    {label:'Law Enforcement',value: 'LAW_ENFORCEMENT'},
    {label:'Medical',        value: 'MEDICAL'},
    {label:'Fishing',        value: 'FISHING'},
    {label:'Towing',         value: 'TOWING'},
    {label:'Towing Long Wide', value: 'TOWING_LONG_WIDE'},
    {label:'Dredging',       value: 'DREDGING'},
    {label:'Diving',         value: 'DIVING'},
    {label:'Military',       value: 'MILITARY'},
    {label:'Sailing',        value: 'SAILING'},
    {label:'Pleasure',       value: 'PLEASURE'},
    {label:'Hsc',            value: 'HSC'},
    {label:'Passenger',      value: 'PASSENGER'},
    {label:'Cargo',          value: 'CARGO'},
    {label:'Tanker',         value: 'TANKER'},
    {label:'Ships According to RR', value: 'SHIPS_ACCORDING_TO_RR'},
    {label:'Unknown',        value: 'UNKNOWN'}
];

sourceTypes = [
	{label:'Any',        value: 'any'},
	{label:'Live',       value: 'live'},
	{label:'Sat',        value: 'sat'}
];

countryList = [
    {label:"AFGHANISTAN",value:"AFG"},
	{label:"ÅLAND ISLANDS",value:"ALA"},
	{label:"ALBANIA",value:"ALB"},
	{label:"ALGERIA",value:"DZA"},
	{label:"AMERICAN SAMOA",value:"ASM"},
	{label:"ANDORRA",value:"AND"},
	{label:"ANGOLA",value:"AGO"},
	{label:"ANGUILLA",value:"AIA"},
	{label:"ANTARCTICA",value:"ATA"},
	{label:"ANTIGUA AND BARBUDA",value:"ATG"},
	{label:"ARGENTINA",value:"ARG"},
	{label:"ARMENIA",value:"ARM"},
	{label:"ARUBA",value:"ABW"},
	{label:"AUSTRALIA",value:"AUS"},
	{label:"AUSTRIA",value:"AUT"},
	{label:"AZERBAIJAN",value:"AZE"},
	{label:"BAHAMAS",value:"BHS"},
	{label:"BAHRAIN",value:"BHR"},
	{label:"BANGLADESH",value:"BGD"},
	{label:"BARBADOS",value:"BRB"},
	{label:"BELARUS",value:"BLR"},
	{label:"BELGIUM",value:"BEL"},
	{label:"BELIZE",value:"BLZ"},
	{label:"BENIN",value:"BEN"},
	{label:"BERMUDA",value:"BMU"},
	{label:"BHUTAN",value:"BTN"},
	{label:"BOLIVIA, PLURINATIONAL STATE OF",value:"BOL"},
	{label:"BONAIRE, SINT EUSTATIUS AND SABA",value:"BES"},
	{label:"BOSNIA AND HERZEGOVINA",value:"BIH"},
	{label:"BOTSWANA",value:"BWA"},
	{label:"BOUVET ISLAND",value:"BVT"},
	{label:"BRAZIL",value:"BRA"},
	{label:"BRITISH INDIAN OCEAN TERRITORY",value:"IOT"},
	{label:"BRUNEI DARUSSALAM",value:"BRN"},
	{label:"BULGARIA",value:"BGR"},
	{label:"BURKINA FASO",value:"BFA"},
	{label:"BURUNDI",value:"BDI"},
	{label:"CAMBODIA",value:"KHM"},
	{label:"CAMEROON",value:"CMR"},
	{label:"CANADA",value:"CAN"},
	{label:"CAPE VERDE",value:"CPV"},
	{label:"CAYMAN ISLANDS",value:"CYM"},
	{label:"CENTRAL AFRICAN REPUBLIC",value:"CAF"},
	{label:"CHAD",value:"TCD"},
	{label:"CHILE",value:"CHL"},
	{label:"CHINA",value:"CHN"},
	{label:"CHRISTMAS ISLAND",value:"CXR"},
	{label:"COCOS (KEELING) ISLANDS",value:"CCK"},
	{label:"COLOMBIA",value:"COL"},
	{label:"COMOROS",value:"COM"},
	{label:"CONGO",value:"COG"},
	{label:"CONGO, THE DEMOCRATIC REPUBLIC OF THE",value:"COD"},
	{label:"COOK ISLANDS",value:"COK"},
	{label:"COSTA RICA",value:"CRI"},
	{label:"CÔTE D'IVOIRE",value:"CIV"},
	{label:"CROATIA",value:"HRV"},
	{label:"CUBA",value:"CUB"},
	{label:"CURAÇAO",value:"CUW"},
	{label:"CYPRUS",value:"CYP"},
	{label:"CZECH REPUBLIC",value:"CZE"},
	{label:"DENMARK",value:"DNK"},
	{label:"DJIBOUTI",value:"DJI"},
	{label:"DOMINICA",value:"DMA"},
	{label:"DOMINICAN REPUBLIC",value:"DOM"},
	{label:"ECUADOR",value:"ECU"},
	{label:"EGYPT",value:"EGY"},
	{label:"EL SALVADOR",value:"SLV"},
	{label:"EQUATORIAL GUINEA",value:"GNQ"},
	{label:"ERITREA",value:"ERI"},
	{label:"ESTONIA",value:"EST"},
	{label:"ETHIOPIA",value:"ETH"},
	{label:"FALKLAND ISLANDS (MALVINAS)",value:"FLK"},
	{label:"FAROE ISLANDS",value:"FRO"},
	{label:"FIJI",value:"FJI"},
	{label:"FINLAND",value:"FIN"},
	{label:"FRANCE",value:"FRA"},
	{label:"FRENCH GUIANA",value:"GUF"},
	{label:"FRENCH POLYNESIA",value:"PYF"},
	{label:"FRENCH SOUTHERN TERRITORIES",value:"ATF"},
	{label:"GABON",value:"GAB"},
	{label:"GAMBIA",value:"GMB"},
	{label:"GEORGIA",value:"GEO"},
	{label:"GERMANY",value:"DEU"},
	{label:"GHANA",value:"GHA"},
	{label:"GIBRALTAR",value:"GIB"},
	{label:"GREECE",value:"GRC"},
	{label:"GREENLAND",value:"GRL"},
	{label:"GRENADA",value:"GRD"},
	{label:"GUADELOUPE",value:"GLP"},
	{label:"GUAM",value:"GUM"},
	{label:"GUATEMALA",value:"GTM"},
	{label:"GUERNSEY",value:"GGY"},
	{label:"GUINEA",value:"GIN"},
	{label:"GUINEA-BISSAU",value:"GNB"},
	{label:"GUYANA",value:"GUY"},
	{label:"HAITI",value:"HTI"},
	{label:"HEARD ISLAND AND MCDONALD ISLANDS",value:"HMD"},
	{label:"HOLY SEE (VATICAN CITY STATE)",value:"VAT"},
	{label:"HONDURAS",value:"HND"},
	{label:"HONG KONG",value:"HKG"},
	{label:"HUNGARY",value:"HUN"},
	{label:"ICELAND",value:"ISL"},
	{label:"INDIA",value:"IND"},
	{label:"INDONESIA",value:"IDN"},
	{label:"IRAN, ISLAMIC REPUBLIC OF",value:"IRN"},
	{label:"IRAQ",value:"IRQ"},
	{label:"IRELAND",value:"IRL"},
	{label:"ISLE OF MAN",value:"IMN"},
	{label:"ISRAEL",value:"ISR"},
	{label:"ITALY",value:"ITA"},
	{label:"JAMAICA",value:"JAM"},
	{label:"JAPAN",value:"JPN"},
	{label:"JERSEY",value:"JEY"},
	{label:"JORDAN",value:"JOR"},
	{label:"KAZAKHSTAN",value:"KAZ"},
	{label:"KENYA",value:"KEN"},
	{label:"KIRIBATI",value:"KIR"},
	{label:"KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF",value:"PRK"},
	{label:"KOREA, REPUBLIC OF",value:"KOR"},
	{label:"KUWAIT",value:"KWT"},
	{label:"KYRGYZSTAN",value:"KGZ"},
	{label:"LAO PEOPLE'S DEMOCRATIC REPUBLIC",value:"LAO"},
	{label:"LATVIA",value:"LVA"},
	{label:"LEBANON",value:"LBN"},
	{label:"LESOTHO",value:"LSO"},
	{label:"LIBERIA",value:"LBR"},
	{label:"LIBYA",value:"LBY"},
	{label:"LIECHTENSTEIN",value:"LIE"},
	{label:"LITHUANIA",value:"LTU"},
	{label:"LUXEMBOURG",value:"LUX"},
	{label:"MACAO",value:"MAC"},
	{label:"MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF",value:"MKD"},
	{label:"MADAGASCAR",value:"MDG"},
	{label:"MALAWI",value:"MWI"},
	{label:"MALAYSIA",value:"MYS"},
	{label:"MALDIVES",value:"MDV"},
	{label:"MALI",value:"MLI"},
	{label:"MALTA",value:"MLT"},
	{label:"MARSHALL ISLANDS",value:"MHL"},
	{label:"MARTINIQUE",value:"MTQ"},
	{label:"MAURITANIA",value:"MRT"},
	{label:"MAURITIUS",value:"MUS"},
	{label:"MAYOTTE",value:"MYT"},
	{label:"MEXICO",value:"MEX"},
	{label:"MICRONESIA, FEDERATED STATES OF",value:"FSM"},
	{label:"MOLDOVA, REPUBLIC OF",value:"MDA"},
	{label:"MONACO",value:"MCO"},
	{label:"MONGOLIA",value:"MNG"},
	{label:"MONTENEGRO",value:"MNE"},
	{label:"MONTSERRAT",value:"MSR"},
	{label:"MOROCCO",value:"MAR"},
	{label:"MOZAMBIQUE",value:"MOZ"},
	{label:"MYANMAR",value:"MMR"},
	{label:"NAMIBIA",value:"NAM"},
	{label:"NAURU",value:"NRU"},
	{label:"NEPAL",value:"NPL"},
	{label:"NETHERLANDS",value:"NLD"},
	{label:"NEW CALEDONIA",value:"NCL"},
	{label:"NEW ZEALAND",value:"NZL"},
	{label:"NICARAGUA",value:"NIC"},
	{label:"NIGER",value:"NER"},
	{label:"NIGERIA",value:"NGA"},
	{label:"NIUE",value:"NIU"},
	{label:"NORFOLK ISLAND",value:"NFK"},
	{label:"NORTHERN MARIANA ISLANDS",value:"MNP"},
	{label:"NORWAY",value:"NOR"},
	{label:"OMAN",value:"OMN"},
	{label:"PAKISTAN",value:"PAK"},
	{label:"PALAU",value:"PLW"},
	{label:"PALESTINE, STATE OF",value:"PSE"},
	{label:"PANAMA",value:"PAN"},
	{label:"PAPUA NEW GUINEA",value:"PNG"},
	{label:"PARAGUAY",value:"PRY"},
	{label:"PERU",value:"PER"},
	{label:"PHILIPPINES",value:"PHL"},
	{label:"PITCAIRN",value:"PCN"},
	{label:"POLAND",value:"POL"},
	{label:"PORTUGAL",value:"PRT"},
	{label:"PUERTO RICO",value:"PRI"},
	{label:"QATAR",value:"QAT"},
	{label:"RÉUNION",value:"REU"},
	{label:"ROMANIA",value:"ROU"},
	{label:"RUSSIAN FEDERATION",value:"RUS"},
	{label:"RWANDA",value:"RWA"},
	{label:"SAINT BARTHÉLEMY",value:"BLM"},
	{label:"SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA",value:"SHN"},
	{label:"SAINT KITTS AND NEVIS",value:"KNA"},
	{label:"SAINT LUCIA",value:"LCA"},
	{label:"SAINT MARTIN (FRENCH PART)",value:"MAF"},
	{label:"SAINT PIERRE AND MIQUELON",value:"SPM"},
	{label:"SAINT VINCENT AND THE GRENADINES",value:"VCT"},
	{label:"SAMOA",value:"WSM"},
	{label:"SAN MARINO",value:"SMR"},
	{label:"SAO TOME AND PRINCIPE",value:"STP"},
	{label:"SAUDI ARABIA",value:"SAU"},
	{label:"SENEGAL",value:"SEN"},
	{label:"SERBIA",value:"SRB"},
	{label:"SEYCHELLES",value:"SYC"},
	{label:"SIERRA LEONE",value:"SLE"},
	{label:"SINGAPORE",value:"SGP"},
	{label:"SINT MAARTEN (DUTCH PART)",value:"SXM"},
	{label:"SLOVAKIA",value:"SVK"},
	{label:"SLOVENIA",value:"SVN"},
	{label:"SOLOMON ISLANDS",value:"SLB"},
	{label:"SOMALIA",value:"SOM"},
	{label:"SOUTH AFRICA",value:"ZAF"},
	{label:"SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS",value:"SGS"},
	{label:"SOUTH SUDAN",value:"SSD"},
	{label:"SPAIN",value:"ESP"},
	{label:"SRI LANKA",value:"LKA"},
	{label:"SUDAN",value:"SDN"},
	{label:"SURINAME",value:"SUR"},
	{label:"SVALBARD AND JAN MAYEN",value:"SJM"},
	{label:"SWAZILAND",value:"SWZ"},
	{label:"SWEDEN",value:"SWE"},
	{label:"SWITZERLAND",value:"CHE"},
	{label:"SYRIAN ARAB REPUBLIC",value:"SYR"},
	{label:"TAIWAN, PROVINCE OF CHINA",value:"TWN"},
	{label:"TAJIKISTAN",value:"TJK"},
	{label:"TANZANIA, UNITED REPUBLIC OF",value:"TZA"},
	{label:"THAILAND",value:"THA"},
	{label:"TIMOR-LESTE",value:"TLS"},
	{label:"TOGO",value:"TGO"},
	{label:"TOKELAU",value:"TKL"},
	{label:"TONGA",value:"TON"},
	{label:"TRINIDAD AND TOBAGO",value:"TTO"},
	{label:"TUNISIA",value:"TUN"},
	{label:"TURKEY",value:"TUR"},
	{label:"TURKMENISTAN",value:"TKM"},
	{label:"TURKS AND CAICOS ISLANDS",value:"TCA"},
	{label:"TUVALU",value:"TUV"},
	{label:"UGANDA",value:"UGA"},
	{label:"UKRAINE",value:"UKR"},
	{label:"UNITED ARAB EMIRATES",value:"ARE"},
	{label:"UNITED KINGDOM",value:"GBR"},
	{label:"UNITED STATES",value:"USA"},
	{label:"UNITED STATES MINOR OUTLYING ISLANDS",value:"UMI"},
	{label:"URUGUAY",value:"URY"},
	{label:"UZBEKISTAN",value:"UZB"},
	{label:"VANUATU",value:"VUT"},
	{label:"VENEZUELA, BOLIVARIAN REPUBLIC OF",value:"VEN"},
	{label:"VIET NAM",value:"VNM"},
	{label:"VIRGIN ISLANDS, BRITISH",value:"VGB"},
	{label:"VIRGIN ISLANDS, U.S.",value:"VIR"},
	{label:"WALLIS AND FUTUNA",value:"WLF"},
	{label:"WESTERN SAHARA",value:"ESH"},
	{label:"YEMEN",value:"YEM"},
	{label:"ZAMBIA",value:"ZMB"},
	{label:"ZIMBABWE",value:"ZWE"}];


outputTableFields = [
    { label:"Longitude", value:"lon" },
    { label:"Latitude", value:"lat" },
    { label:"MMSI", value:"mmsi" },
    { label:"Time", value:"time" },
    { label:"Timestamp", value:"timestamp" }
];


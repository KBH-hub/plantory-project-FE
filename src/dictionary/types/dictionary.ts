export type DictionaryCardItem = {
  cntntsNo?: string | number;
  cntntsSj?: string;
  distbNm?: string;
  rtnThumbFileUrl?: string;
  rtnFileUrl?: string;
  thumbUrl?: string;
  imageUrl?: string;
};

export type GardenItem = DictionaryCardItem & {
  _searchKey?: string;
};

export type GardenApiResponse = {
  body?: {
    items?: {
      item?: DictionaryCardItem | DictionaryCardItem[];
      totalCount?: string | number;
      pageNo?: string | number;
      numOfRows?: string | number;
    };
  };
};

export type GardenFileItem = {
  rtnThumbFileUrl?: string;
  rtnFileUrl?: string;
  rtnImageDc?: string;
};

export type GardenDetailItem = {
  cntntsNo?: string | number;
  distbNm?: string;

  managelevelCodeNm?: string;
  dlthtsCodeNm?: string;
  grwtveCodeNm?: string;
  smellCodeNm?: string;
  grwhTpCodeNm?: string;
  winterLwetTpCodeNm?: string;
  hdCodeNm?: string;

  watercycleSprngCodeNm?: string;
  watercycleSummerCodeNm?: string;
  watercycleAutumnCodeNm?: string;
  watercycleWinterCodeNm?: string;

  fmlCodeNm?: string;
  orgplceInfo?: string;
  clCodeNm?: string;
  grwhstleCodeNm?: string;
  flclrCodeNm?: string;
  lefcolrCodeNm?: string;
  eclgyCodeNm?: string;

  fncltyInfo?: string;
  adviseInfo?: string;
};

export type GardenDictionaryResponse = {
  files?: {
    body?: {
      items?: {
        item?: GardenFileItem | GardenFileItem[];
      };
    };
  };
  detail?: {
    body?: {
      item?: GardenDetailItem;
    };
  };
};

export type DryItem = {
  cntntsNo?: string | number;
  cntntsSj?: string;
  thumbImgUrl1?: string;
  thumbImgUrl2?: string;
  imgUrl1?: string;
  imgUrl2?: string;
  _searchKey?: string;
};

export type DryApiResponse = {
  body?: {
    items?: {
      item?: DryItem | DryItem[];
      totalCount?: string | number;
      pageNo?: string | number;
      numOfRows?: string | number;
    };
  };
};

export type DryDetailItem = {
  cntntsSj?: string;
  distbNm?: string;

  scnm?: string;
  clNm?: string;
  orgplce?: string;

  manageLevelNm?: string;
  dlthtsInfo?: string;
  grwtseVeNm?: string;
  lighttInfo?: string;
  lfclChngeInfo?: string;

  grwhTpInfo?: string;
  grwtInfo?: string;
  pswntrTpInfo?: string;
  hgtmMhmrInfo?: string;

  waterCycleInfo?: string;

  stleSeNm?: string;
  rdxStleNm?: string;
  chartrInfo?: string;

  flwrInfo?: string;
  frtlzrInfo?: string;
  prpgtInfo?: string;
  tipInfo?: string;
  batchPlaceInfo?: string;

  mainImgUrl1?: string;
  mainImgUrl2?: string;
  lightImgUrl1?: string;
  lightImgUrl2?: string;
  lightImgUrl3?: string;
};

export type DryDetailResponse = {
  body?: {
    item?: DryDetailItem;
  };
};
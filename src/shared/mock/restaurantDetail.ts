/**
 * 레스토랑 상세 페이지 샘플 데이터
 * - OpenAI API 없이 테스트용
 */

export const SAMPLE_RESTAURANT_DETAIL = {
  "ChIJ_____xxcwokRvgheZgxjWtk": {
    "place_id": "ChIJ_____xxcwokRvgheZgxjWtk",
    "name": "Queen",
    "grid": "BK4",
    "address": "247 Starr St, Brooklyn, NY 11237, USA",
    "rating": 4.5,
    "user_ratings_total": 712,
    "primaryType": "mediterranean_restaurant",
    "district": "Brooklyn",
    "generated_tags": [
      "맛 좋음",
      "서비스 좋음",
      "분위기 좋음"
    ]
  },
  "ChIJGwwLdFdbwokRwgGRO2tpb_8": {
    "place_id": "ChIJGwwLdFdbwokRwgGRO2tpb_8",
    "name": "OFF THE GRILL",
    "grid": "BK8",
    "address": "602 Nostrand Ave, Brooklyn, NY 11216, USA",
    "rating": 4.9,
    "user_ratings_total": 105,
    "primaryType": "mediterranean_restaurant",
    "district": "Brooklyn",
    "generated_tags": [
      "맛 좋음",
      "서비스 좋음"
    ]
  },
  "ChIJMym7EABbwokRxlS0FZasyTg": {
    "place_id": "ChIJMym7EABbwokRxlS0FZasyTg",
    "name": "Grilled",
    "grid": "BK8",
    "address": "567 Lincoln Pl, Brooklyn, NY 11238, USA",
    "rating": 4.8,
    "user_ratings_total": 18,
    "primaryType": "mediterranean_restaurant",
    "district": "Brooklyn",
    "generated_tags": [
      "맛 좋음",
      "서비스 좋음"
    ]
  }
};

export const SAMPLE_RECOMMENDED_RESTAURANTS = {
  "ChIJ_____xxcwokRvgheZgxjWtk": [
    {
      "place_id": "ChIJGwwLdFdbwokRwgGRO2tpb_8",
      "name": "OFF THE GRILL",
      "grid": "BK8",
      "address": "602 Nostrand Ave, Brooklyn, NY 11216, USA",
      "rating": 4.9,
      "user_ratings_total": 105,
      "primaryType": "mediterranean_restaurant",
      "district": "Brooklyn",
      "generated_tags": [
        "맛 좋음",
        "서비스 좋음"
      ],
      "match_reason": "같은 구역(district) + 같은 타입 + 유사한 강점"
    },
    {
      "place_id": "ChIJMym7EABbwokRxlS0FZasyTg",
      "name": "Grilled",
      "grid": "BK8",
      "address": "567 Lincoln Pl, Brooklyn, NY 11238, USA",
      "rating": 4.8,
      "user_ratings_total": 18,
      "primaryType": "mediterranean_restaurant",
      "district": "Brooklyn",
      "generated_tags": [
        "맛 좋음",
        "서비스 좋음"
      ],
      "match_reason": "같은 구역(district) + 같은 타입 + 유사한 강점"
    },
    {
      "place_id": "ChIJ41GzBwBPwokRhRc0N9ckwk4",
      "name": "Laila Bayridge",
      "grid": "BK10",
      "address": "8530 3rd Ave, Brooklyn, NY 11209, USA",
      "rating": 4.8,
      "user_ratings_total": 1194,
      "primaryType": "mediterranean_restaurant",
      "district": "Brooklyn",
      "generated_tags": [
        "맛 좋음",
        "서비스 좋음",
        "분위기 좋음"
      ],
      "match_reason": "같은 구역(district) + 같은 타입 + 유사한 강점"
    },
    {
      "place_id": "ChIJyaPHBE9ZwokRve8gtGX8BNo",
      "name": "Dar525",
      "grid": "BK1",
      "address": "168 Driggs Ave, Brooklyn, NY 11222, USA",
      "rating": 4.7,
      "user_ratings_total": 518,
      "primaryType": "mediterranean_restaurant",
      "district": "Brooklyn",
      "generated_tags": [
        "맛 좋음",
        "서비스 좋음"
      ],
      "match_reason": "같은 구역(district) + 같은 타입 + 유사한 강점"
    },
    {
      "place_id": "ChIJ8aNS0S1FwokR4XZ9l4e2N-I",
      "name": "Si n'shpi",
      "grid": "BK11",
      "address": "2307 65th St, Brooklyn, NY 11204, USA",
      "rating": 4.7,
      "user_ratings_total": 216,
      "primaryType": "mediterranean_restaurant",
      "district": "Brooklyn",
      "generated_tags": [
        "맛 좋음",
        "서비스 좋음"
      ],
      "match_reason": "같은 구역(district) + 같은 타입 + 유사한 강점"
    }
  ]
};

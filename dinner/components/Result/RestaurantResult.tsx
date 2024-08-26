import React from 'react';

interface RestaurantDetails {
  name: string;
  formattedAddress: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  rating?: number;
  websiteUri?: string;
  regularOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  googleMapsUri?: string;
  reviews?: {
    name: string;
    relativePublishTimeDescription: string;
    rating: number;
    text: {
      text: string;
    };
    authorAttribution: {
      displayName: string;
      uri: string;
      photoUri: string;
    };
  }[];
  photos?: {
    name: string;
    widthPx: number;
    heightPx: number;
    authorAttributions: {
      displayName: string;
      uri: string;
      photoUri: string;
    }[];
  }[];
}

interface Props {
  details: RestaurantDetails;
}

const RestaurantResult: React.FC<Props> = ({ details }) => {
  return (
    <div className="restaurant-details">
      <h2>{details.name}</h2>
      <p>{details.formattedAddress}</p>
      {details.nationalPhoneNumber && <p>Phone: {details.nationalPhoneNumber}</p>}
      {details.internationalPhoneNumber && <p>International Phone: {details.internationalPhoneNumber}</p>}
      {details.rating && <p>Rating: {details.rating} stars</p>}
      {details.websiteUri && <a href={details.websiteUri} target="_blank" rel="noopener noreferrer">Visit Website</a>}
      {details.googleMapsUri && <a href={details.googleMapsUri} target="_blank" rel="noopener noreferrer">View on Google Maps</a>}

      {details.regularOpeningHours && (
        <div>
          <h3>Opening Hours:</h3>
          <ul>
            {details.regularOpeningHours.weekdayDescriptions.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        </div>
      )}

      {details.reviews && details.reviews.length > 0 && (
        <div>
          <h3>Reviews:</h3>
          {details.reviews.map((review, index) => (
            <div key={index} className="review">
              <p><strong>{review.authorAttribution.displayName}</strong> ({review.relativePublishTimeDescription}):</p>
              <p>Rating: {review.rating} stars</p>
              <p>{review.text.text}</p>
            </div>
          ))}
        </div>
      )}

      {details.photos && details.photos.length > 0 && (
        <div>
          <h3>Photos:</h3>
          <div className="photos">
            {details.photos.map((photo, index) => (
              <div key={index} className="photo">
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photo.widthPx}&photoreference=${photo.name}&key=YOUR_GOOGLE_PLACES_API_KEY`}
                  alt={`Photo by ${photo.authorAttributions[0].displayName}`}
                />
                <p>Photo by <a href={photo.authorAttributions[0].uri} target="_blank" rel="noopener noreferrer">{photo.authorAttributions[0].displayName}</a></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantResult;
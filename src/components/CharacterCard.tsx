import { Link } from "react-router-dom";
import type { Character } from "../models/model";
import lifeline from "../assets/icons/lifeline.png";
import location from "../assets/icons/location.png";
import HeartIcon from "../assets/icons/heart.png";         // outline
import HeartFilledIcon from "../assets/icons/heart-filled.png"; // filled

interface CharacterCardProps {
  character: Character;
  onFavoriteToggle?: (id: number) => void;
  isFavorite?: boolean;
}

const CharacterCard = ({
  character,
  onFavoriteToggle,
  isFavorite = false,
}: CharacterCardProps) => {
  return (
    <article className="block rounded-lg bg-gray-200 p-4 shadow-xs shadow-indigo-100 ring-1 ring-gray-200 hover:shadow-md transition">
      <div className="relative">
        <Link to={`characters/${character.id}`}>
          <img
            alt={character.name}
            src={character.image}
            className="h-56 w-full rounded-md object-cover"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Body */}
      <div className="mt-2">
        <dl className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <dd className="font-medium text-gray-900">{character.name}</dd>

            {/* Favorite beside name alternative: uncomment to show here instead of over image */}
            {onFavoriteToggle && (
              <button
                onClick={() => onFavoriteToggle(character.id)}
                 className="z-10 rounded-full bg-white/100 p-2 backdrop-blur transition hover:scale-110 cursor-pointer"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
 <img
      src={isFavorite ? HeartFilledIcon : HeartIcon}
      alt={isFavorite ? "Unfavorite" : "Favorite"}
      className="w-6 h-6"
      draggable={false}
    />              </button>
            )}
          </div>

          {/* Subline (acts like “Price” in your example). Use concise meta: Species • Gender • Origin */}
          <div>
            <dd className="text-sm text-gray-500">
              {[
                character.species,
                character.gender,
                character.location?.name || character.origin?.name,
              ]
                .filter(Boolean)
                .join(" • ")}
            </dd>
          </div>
        </dl>

        {/* Meta row with three inline SVG items, styled like your example */}
        <div className="mt-6 flex items-center gap-8 text-xs">
          {/* Status (like “Parking”) */}
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <img src={lifeline} alt="alive-dead" width={24} />
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Status</p>
              <p className="font-medium text-gray-900">{character.status}</p>
            </div>
          </div>

          {/* Location (like “Bedroom”) */}
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <img src={location} alt="location" width={24} />
            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Location</p>
              <p className="font-medium text-gray-900 truncate max-w-[140px]" title={character.location?.name} >
                
                {character.location?.name || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CharacterCard;

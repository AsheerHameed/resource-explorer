import { Link } from "react-router-dom";
import type { Character } from "../models/model";
import lifeline from "../assets/icons/lifeline.png";
import locationIcon from "../assets/icons/location.png";
import HeartIcon from "../assets/icons/heart.png";
import HeartFilledIcon from "../assets/icons/heart-filled.png";

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
    <article className="block rounded-lg bg-gray-100 p-4 ring-1 ring-gray-200 shadow-xs hover:shadow-md transition">
      <div className="relative">
        <Link to={`characters/${character.id}`}>
          <img
            src={character.image}
            alt={character.name}
            className="h-full w-full rounded-md object-contain"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <span className="font-medium text-gray-900 truncate">
            {character.name}
          </span>
          {onFavoriteToggle && (
            <button
              onClick={() => onFavoriteToggle(character.id)}
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white backdrop-blur hover:scale-110 transition cursor-pointer"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <img
                src={isFavorite ? HeartFilledIcon : HeartIcon}
                alt={isFavorite ? "Unfavorite" : "Favorite"}
                className="w-3 h-3 sm:w-5 sm:h-5"
                draggable={false}
              />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500 truncate">
          {[
            character.species,
            character.gender,
            character.location?.name || character.origin?.name,
          ]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-8 text-xs">
        <MetaItem icon={lifeline} label="Status" value={character.status} />
        <MetaItem
          icon={locationIcon}
          label="Location"
          value={character.location?.name || "Unknown"}
          truncate
        />
      </div>
    </article>
  );
};

function MetaItem({
  icon,
  label,
  value,
  truncate = false,
}: {
  icon: string;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
      <img src={icon} alt={label} className="w-6 h-6" />
      <div className="mt-1.5 sm:mt-0">
        <p className="text-gray-500">{label}</p>
        <p
          className={`font-medium text-gray-900 ${
            truncate ? "truncate max-w-[140px]" : ""
          }`}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default CharacterCard;

# StarRating Component

Finalna wersja komponentu do wyświetlania i interakcji z ocenami gwiazdkowymi.

## Import

```tsx
import { StarRating } from "@/components/ui/StarRating";
// lub dla specyficznej wersji
import { StarRatingIcons } from "@/components/ui/StarRating";
```

## Podstawowe użycie

### Wyświetlanie oceny (tylko do odczytu)

```tsx
// Podstawowa ocena
<StarRating rating={4.25} />

// Z wyświetloną wartością liczbową
<StarRating rating={4.25} showValue />

// Różne rozmiary
<StarRating rating={4.25} size="sm" showValue />
<StarRating rating={4.25} size="md" showValue />
<StarRating rating={4.25} size="lg" showValue />
```

### Interaktywna ocena (klikalna)

```tsx
const [rating, setRating] = useState(0);

<StarRating
  rating={rating}
  interactive
  onRatingChange={setRating}
  showValue
  size="lg"
/>;
```

## Props

| Prop             | Type                       | Default  | Opis                                                                |
| ---------------- | -------------------------- | -------- | ------------------------------------------------------------------- |
| `rating`         | `number`                   | -        | Ocena do wyświetlenia (0-5, może być ułamkowa np. 4.25)             |
| `maxStars`       | `number`                   | `5`      | Maksymalna liczba gwiazdek                                          |
| `size`           | `"sm" \| "md" \| "lg"`     | `"md"`   | Rozmiar gwiazdek                                                    |
| `className`      | `string`                   | -        | Dodatkowe klasy CSS                                                 |
| `showValue`      | `boolean`                  | `false`  | Czy wyświetlać wartość liczbową obok gwiazdek                       |
| `interactive`    | `boolean`                  | `false`  | Czy gwiazdki są klikalne                                            |
| `onRatingChange` | `(rating: number) => void` | -        | Callback wywoływany po kliknięciu (wymagane gdy `interactive=true`) |
| `precision`      | `"full" \| "half"`         | `"full"` | Precyzja kliknięć (pełne gwiazdki lub połówki)                      |

## Przykłady użycia

### W formularzu oceny

```tsx
function RatingForm() {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Proszę wybrać ocenę");
      return;
    }
    // Wyślij ocenę
    console.log("Ocena:", rating);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Oceń swoje doświadczenie:
        </label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
          showValue
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Wyślij ocenę
      </button>
    </div>
  );
}
```

### Wyświetlanie średniej oceny

```tsx
function ProductRating({ averageRating, reviewCount }) {
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={averageRating} size="sm" />
      <span className="text-sm text-gray-600">
        {averageRating.toFixed(1)} ({reviewCount} opinii)
      </span>
    </div>
  );
}
```

### Lista z różnymi ocenami

```tsx
function ReviewsList({ reviews }) {
  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex items-center justify-between p-3 border rounded"
        >
          <div>
            <p className="font-medium">{review.author}</p>
            <p className="text-sm text-gray-600">{review.comment}</p>
          </div>
          <StarRating rating={review.rating} size="sm" showValue />
        </div>
      ))}
    </div>
  );
}
```

## Implementacja techniczna

Komponent używa:

- **Lucide React Icons** - ikony gwiazdek
- **CSS overflow** - dla częściowego wypełnienia
- **Tailwind CSS** - stylowanie i responsywność
- **React useState** - stan hover dla interaktywności
- **TypeScript** - typowanie props

## Dostępność

- ✅ Właściwe etykiety `aria-label` dla przycisków
- ✅ Obsługa klawiatury (focus/blur)
- ✅ Wysokiy kontrast kolorów
- ✅ Skalowalne rozmiary

## Kolory

- **Wypełnione gwiazdki**: `text-yellow-400 fill-yellow-400`
- **Puste gwiazdki**: `text-gray-300`
- **Hover (interaktywne)**: `hover:text-yellow-200`

## Notatki techniczne

1. **Częściowe wypełnienie**: Używa CSS `overflow: hidden` z procentową szerokością
2. **Interaktywność**: Obsługuje hover i kliknięcia z animacjami
3. **Performance**: Optymalizowane re-renderowanie tylko przy zmianie props
4. **Browser support**: Działa we wszystkich nowoczesnych przeglądarkach

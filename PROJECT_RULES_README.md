1. Odpowiedzi z backendu (BE) powinny być w formie kodów błędów i odpowiedzi, aby pliki tłumaczeń mogły zawierać swój tekst przypisany do odpowiedniego kodu.
2. Globalne typy, możliwe do użycia po stronie klienta i serwera, przechowuj w `@/lib/globalTypes`.
3. Aplikacja ma przeznaczone miejsce na opcje, które można uznać za opcje konfiguracyjne (np. długość nickname'u.) Katalog to `@/configs/`, gdzie nazwą pliku jest odpowiedni interfejs. (np. accountRegister.ts jako plik odpowiedzialny za tworzenie konta i ustalanie nicku).
4. Funkcje klienckie do zapytań API powinny być oddzielne, korzystać z customowej funkcji fetch (`apiFetch`) i znajdować się w `@/lib/services/api/[nazwa pliku odpowiadająca endpointowi, np. account.ts]`.
5. Funkcje serwerowe odpowiedzialne za kwerendy do Firestore umieszczaj w `@/lib/services/queries/[nazwa pliku odpowiadająca endpointowi, np. account.ts]`.
6. Pliki `route.ts` nie powinny być zbyt rozbudowane – eksportuj funkcjonalności do `utils.ts` w tym samym katalogu, jeśli to możliwe.
7. Do elementów formularzy jest komponent <FormElement />, wraper, który dodaje <Label> oraz opis z obsługą labela błędów. Lepiej pakować każdy potencjalny element w FormElement, dla zachowania spójności.


## How Would I Scale This to 100k Users?

1. Right now, only one Node.js server is running. If 1,000 users submit journals at the same time, that single server will choke.
    
    To solve this problem, we can use **horizontal scaling** by running multiple copies of the backend behind a **load balancer**. A load balancer (like Nginx) sits in front and distributes incoming requests across multiple server instances.
    
2. When 100k users perform read queries at the same time, it can overwhelm a single MongoDB server. The solution is to use **MongoDB Atlas with read replicas**. These are additional copies of the database that handle read operations, while the main database handles write operations. This prevents the primary database from being overloaded.
3. Instead of blocking the request while waiting for the full LLM response, we can use a **streaming approach**. When a user submits a journal entry, the backend sends the text to the LLM and streams the generated tokens back to the frontend in real time.
    
    This allows the user to see the analysis appear gradually instead of waiting several seconds for the complete response. The final analysis is then stored in the database once the stream finishes. This approach improves perceived performance and provides a smoother user experience.
    

---

## How Would I Reduce LLM Cost?

1. We can use a **cheaper or smaller model first**.
    
    Not every journal requires a high-end LLM. We can route requests based on length and complexity:
    
    1. Short journal (< 100 words) → use a smaller, cheaper model 
    2. Long or complex journals → use the bigger model
2. We can **optimize the prompt**. Instead of sending the entire journal to the LLM when it is very long, we can send a summary or only the first and last 100 words to capture the emotional tone.
3. If users do not need instant analysis, we could **batch 10–20 journals together** and process them in a single API call using a structured prompt.

---

## How Would I Cache Repeated Analysis?

1. If a user accidentally submits the same journal entry twice (or copy-pastes the same entry), we should not call the LLM again. The approach would be:
    1. Hash the journal content using SHA-256
    2. Check Redis: "have we seen this hash before?"
    3. If yes → return cached result, skip LLM call entirely
2. Don't cache the raw journal text itself in Redis.
3. Don't cache analysis results for too long. If the LLM model is updated, old cached analysis may use outdated logic

---

## How Would I Protect Sensitive Journal Data?

1. We can add **encryption** so that the journal text is encrypted *before* it reaches the database.
2. Every API endpoint that accesses journal data must:
    1. Verify that the user's **JWT token** is valid
    2. Check that the journal being accessed **belongs to that user**
3. If we cache anything in Redis, it should only be the **emotion analysis result**, never the raw journal text. Redis is often less secure than the main database.
4. Rate Limiting and Input Validation
    1. Apply **rate limiting** to the journal submission endpoint (e.g., a maximum of 20 submissions per hour per user) to prevent abuse.
    2. **Validate and sanitize** all input before storing it, reject extremely large payloads, and strip potentially dangerous characters.
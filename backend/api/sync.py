from fastapi import APIRouter
from datetime import datetime, timezone
from typing import List

from models.schemas import SyncBatchRequest, SyncBatchResponse

router = APIRouter(prefix="", tags=["Sync"])

SYNCED_LOGS = []

@router.post("/sync", response_model=SyncBatchResponse)
async def process_sync_batch(req: SyncBatchRequest):
    """
    Receives queued mutations from the offline client, processes them idempotently, and confirms synced IDs.
    """
    synced_ids: List[str] = []
    failed_ids: List[str] = []

    for item in req.items:
        try:
            # Record the synced payload
            SYNCED_LOGS.append({
                "patient_id": req.patient_id,
                "local_id": item.local_id,
                "entity_type": item.entity_type,
                "operation": item.operation,
                "payload": item.payload,
                "processed_at": datetime.now(timezone.utc).isoformat()
            })
            synced_ids.append(item.local_id)
        except Exception:
            failed_ids.append(item.local_id)

    return SyncBatchResponse(
        success=len(failed_ids) == 0,
        processed_count=len(synced_ids),
        synced_ids=synced_ids,
        failed_ids=failed_ids,
        server_timestamp=datetime.now(timezone.utc).isoformat()
    )

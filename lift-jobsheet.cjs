const fs = require('fs');

let content = fs.readFileSync('components/company/RequestsView.tsx', 'utf8');

// Step 1: Simplify JobSheetButton component
const oldJobSheetButton = `function JobSheetButton({ request }: { request: MovingRequest }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
        title="Vizualizează Job Sheet"
      >
        <FileText size={14} />
        Job Sheet
      </button>
      <JobSheetModal request={request} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}`;

const newJobSheetButton = `function JobSheetButton({ request, onClick }: { request: MovingRequest; onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
      title="Vizualizează Job Sheet"
    >
      <FileText size={14} />
      Job Sheet
    </button>
  );
}`;

content = content.replace(oldJobSheetButton, newJobSheetButton);

// Step 2: Add state in RequestsView
const oldStateDeclaration = `  // Unlock state management
  const [unlockMap, setUnlockMap] = useState<Record<string, boolean>>({});
  const [unlockingId, setUnlockingId] = useState<string | null>(null);`;

const newStateDeclaration = `  // Unlock state management
  const [unlockMap, setUnlockMap] = useState<Record<string, boolean>>({});
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  
  // Job Sheet modal state
  const [jobSheetRequest, setJobSheetRequest] = useState<MovingRequest | null>(null);
  const [showJobSheet, setShowJobSheet] = useState(false);`;

content = content.replace(oldStateDeclaration, newStateDeclaration);

// Step 3: Update JobSheetButton usage
content = content.replace(
  /<JobSheetButton request={r} \/>/g,
  '<JobSheetButton request={r} onClick={() => { setJobSheetRequest(r); setShowJobSheet(true); }} />'
);

// Step 4: Add modal at the end of RequestsView return (before the final closing tags)
// Find the last </div> before the function ends
const insertPoint = content.lastIndexOf('      )}');
if (insertPoint !== -1) {
  const beforeModal = content.substring(0, insertPoint + 10);
  const afterModal = content.substring(insertPoint + 10);
  
  const modalCode = `

      {/* Job Sheet Modal - Rendered at top level */}
      {jobSheetRequest && (
        <JobSheetModal
          request={jobSheetRequest}
          isOpen={showJobSheet}
          onClose={() => {
            setShowJobSheet(false);
            setJobSheetRequest(null);
          }}
        />
      )}`;
  
  content = beforeModal + modalCode + afterModal;
}

fs.writeFileSync('components/company/RequestsView.tsx', content, 'utf8');
console.warn('JobSheet modal lifted to top level!');

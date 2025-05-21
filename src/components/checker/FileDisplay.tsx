
interface FileDisplayProps {
  file: File;
}

export function FileDisplay({ file }: FileDisplayProps) {
  return (
    <div className="bg-secondary/50 p-4 rounded-lg">
      <p className="font-medium">{file.name}</p>
      <p className="text-sm text-muted-foreground">
        {(file.size / 1024).toFixed(2)} KB
      </p>
    </div>
  );
}

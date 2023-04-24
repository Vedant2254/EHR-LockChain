export default function SkeletonLoader({
  status,
  SkeletonComponent,
  RetryComponent,
  DataComponent,
}) {
  return status == "success" ? (
    <DataComponent />
  ) : status == "failure" ? (
    <RetryComponent />
  ) : (
    <SkeletonComponent />
  );
}

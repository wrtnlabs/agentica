// Convert first letter to uppercase (ex: aws-s3 -> AwsS3)
export const capitalize = (service: string): string => {
  return service
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

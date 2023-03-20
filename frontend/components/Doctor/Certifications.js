export default function Certifications({ certificates }) {
  return certificates.map((certificate, index) => {
    return <div key={index}>Certificates</div>;
  });
}

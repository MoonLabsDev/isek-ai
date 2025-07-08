import { Translation } from '@/labels/Translation';

interface Image_GeneratedProps {
  image?: string;
  altText: string;
  height?: string;
  width?: string;
}

const Image_Generated = ({
  image,
  altText,
  height = 'h-96',
  width = 'w-full',
}: Image_GeneratedProps) => {
  if (image) {
    return (
      <div className="relative">
        <img
          src={`data:image/png;base64,${image}`}
          alt={altText}
          className={`${width} ${height} object-cover rounded-lg shadow-lg`}
          onError={e => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${width} ${height} bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600`}
    >
      <div className="text-center text-gray-400">
        <svg
          className="w-16 h-16 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg">
          <Translation id="components.imageGenerated.noImageGenerated" />
        </p>
        <p className="text-sm">
          <Translation id="components.imageGenerated.clickGenerateImage" />
        </p>
      </div>
    </div>
  );
};

export default Image_Generated;

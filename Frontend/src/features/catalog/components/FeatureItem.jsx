const FeatureItem = ({ icon, title, subtitle }) => {
    return (
        <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">
                {icon}
            </span>
            <div>
                <h4 className="font-bold text-sm text-dark-text">
                    {title}
                </h4>
                <p className="text-xs text-subtle-text">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

export default FeatureItem;

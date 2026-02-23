
import React from 'react';
import { VerifiableCredential } from '../types';
import { Calendar, ExternalLink, Hash, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface CredentialCardProps {
  credential: VerifiableCredential;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({ credential }) => {
  const issueDate = format(parseISO(credential.issuanceDate), 'MMM dd, yyyy');
  
  const getTypeColor = (type: string | string[]) => {
    const typeStr = Array.isArray(type) ? type.join(' ') : type;
    if (typeStr.includes('government_id') || typeStr.includes('PhysicalCredential')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (typeStr.includes('professional')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    if (typeStr.includes('education') || typeStr.includes('EducationCredential')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (typeStr.includes('social') || typeStr.includes('SocialCredential')) return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
    return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  };

  const displayType = Array.isArray(credential.type) 
    ? credential.type.find(t => t !== 'VerifiableCredential') || credential.type[0]
    : credential.type;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(credential.type)}`}>
          {displayType.replace('Credential', '').replace('_', ' ')}
        </div>
        <div className="flex items-center space-x-1 text-emerald-500">
          <span className="text-[10px] font-bold uppercase">Verified</span>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
        {credential.credentialSubject.title || 'Verifiable Credential'}
      </h3>
      <p className="text-sm text-gray mb-4 line-clamp-2">
        Issued by {credential.issuer}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-xs text-gray">
          <Calendar className="w-3.5 h-3.5" />
          <span>{issueDate}</span>
        </div>
        {credential.ipfsCid && (
          <div className="flex items-center space-x-2 text-xs text-gray">
            <Hash className="w-3.5 h-3.5" />
            <span className="truncate">{credential.ipfsCid.slice(0, 10)}...</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <button className="text-xs font-bold text-primary flex items-center hover:underline">
          <Info className="w-3.5 h-3.5 mr-1" />
          Details
        </button>
        {credential.ipfsCid && (
          <a 
            href={`https://gateway.pinata.cloud/ipfs/${credential.ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-gray hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
